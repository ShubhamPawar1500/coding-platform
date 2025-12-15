const PISTON_API = "https://emkc.org/api/v2/piston"

const LANGUAGE_VERSION = {
    javascript: {langauge:"javascript", version: "18.15.0"},
    java: {langauge:"java", version: "15.0.2"},
    python: {langauge:"python", version: "3.10.0"},
}

export async function executeCode(langauge, code) {
    try {
        const langaugeConfig = LANGUAGE_VERSION[langauge]

        if(!langaugeConfig){
            return{
                success: false,
                error: `Unsupported language: ${langauge}`
            }
        }

        const res = await fetch(`${PISTON_API}/execute`, {
            method: 'POST',
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language: langaugeConfig.langauge,
                version: langaugeConfig.version,
                files:[
                    {
                        name:`main.${getFileExtension(langauge)}`,
                        content: code
                    }
                ]
            })
        })

        if(!res.ok){
            return{
                success: false,
                error: `HTTP error! status: ${res.status}`
            }
        }

        const data = await res.json()

        const output = data.run.output || ""
        const stderr = data.run.stderr || ""

        if(stderr){
            return {
                success: false,
                output: output,
                error: stderr
            }
        }

        return {
            success: true,
            output: output || "No Output"
        }

    } catch (error) {
        return {
            success: false,
            error: `Failed to execute the code: ${error.message}`,
        };
    }
}

function getFileExtension(langauge) {
    const extensions = {
        javascript: "js",
        python: "py",
        java: "java"
    };
    return extensions[langauge] || "txt";
}