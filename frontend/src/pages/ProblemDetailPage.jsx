import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import ProblemDescription from "../components/ProblemDescription";
import { executeCode } from "../lib/piston";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const ProblemDetailPage = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [currentProblemId, setCurrentProblemId] = useState("two-sum");
    const [selectedLangauge, setSelectedLangauge] = useState("javascript");
    const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
    const [output, setOutput] = useState(null);
    const [isRunning, setIsRunning] = useState(false);

    const currentProblem = PROBLEMS[currentProblemId]

    useEffect(() => {
        if (id && PROBLEMS[id]) {
            setCurrentProblemId(id);
            setCode(PROBLEMS[id].starterCode[selectedLangauge]);
            setOutput(null);
        }
    }, [id, selectedLangauge])

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setSelectedLangauge(newLang);
        setCode(currentProblem.starterCode[newLang]);
        setOutput(null)
    }

    const handleProblemChange = (newProblemId) => navigate(`/problems/${newProblemId}`)

    const triggerConfetti = () => {
        confetti({
            particleCount: 80,
            spread: 250,
            origin: { x: 0.2, y: 0.6 },
        });

        confetti({
            particleCount: 80,
            spread: 250,
            origin: { x: 0.8, y: 0.6 },
        });
    };

    const normalizeOutput = (output) => {
        // normalize output for comparison (trim whitespace, handle different spacing)
        return output
            .trim()
            .split("\n")
            .map((line) =>
                line
                    .trim()
                    // remove spaces after [ and before ]
                    .replace(/\[\s+/g, "[")
                    .replace(/\s+\]/g, "]")
                    // normalize spaces around commas to single space after comma
                    .replace(/\s*,\s*/g, ",")
            )
            .filter((line) => line.length > 0)
            .join("\n");
    };

    const checkIfTestPassed = (actualOutput, expectedOutput) => {
        const normalizeActual = normalizeOutput(actualOutput);
        const normalizeExpected = normalizeOutput(expectedOutput);

        return normalizeActual == normalizeExpected;
    }

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput(null);

        const result = await executeCode(selectedLangauge, code);
        setOutput(result);
        setIsRunning(false);

        if (result.success) {
            const expectedOutput = currentProblem.expectedOutput[selectedLangauge];
            const testpassed = checkIfTestPassed(result.output, expectedOutput);

            if (testpassed) {
                triggerConfetti()
                toast.success("All tests passed! Great job!");
            } else {
                toast.error("Test Failed. Check your output!")
            }
        } else {
            toast.error("Code Execution Failed");
        }
    }

    return (
        <div className="h-screen w-screen bg-base-100 flex flex-col">
            <Navbar />

            <div className="flex-1">
                <PanelGroup direction="horizontal">
                    {/* left */}
                    <Panel defaultSize={40} minSize={30}>
                        <ProblemDescription
                            problem={currentProblem}
                            currentProblemId={currentProblemId}
                            onProblemChange={handleProblemChange}
                            allProblems={Object.values(PROBLEMS)}
                        />
                    </Panel>

                    <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

                    {/* right */}
                    <Panel defaultSize={60} minSize={30}>
                        <PanelGroup direction="vertical">
                            {/* Top */}
                            <Panel defaultSize={60} minSize={30}>
                                <CodeEditorPanel
                                    selectedLangauge={selectedLangauge}
                                    code={code}
                                    isRunning={isRunning}
                                    onLanguageChange={handleLanguageChange}
                                    onCodeChage={setCode}
                                    onRunCode={handleRunCode}
                                />
                            </Panel>

                            <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                            {/* Bottom */}
                            <Panel defaultSize={40} minSize={30}>
                                <OutputPanel output={output} />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    )
}

export default ProblemDetailPage;