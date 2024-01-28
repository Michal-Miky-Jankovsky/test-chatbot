/**
 * Vanilla StackAI
 *
 * override default StackAI script to not conflict with
 */
(function () {
    "use strict";
    const
        iframeId = "responsiveIframe",
        widthMobile = "100vw", // original "100vw"
        heightMobile = "616px", // original "38.5rem"
        widthDesktop = "560px", // original "35rem"
        heightDesktop = "616px"; // original "38.5rem"

    function messageListener(event) {
        const t = document.getElementById(iframeId);

        t &&
        event.data.type === "chatbotStateChange"
        && (
            event.data.isClosed ?
                setTimeout(() => {
                    t.style.width = widthMobile, t.style.height = heightMobile
                }, 300) :
                window.innerWidth < 1e3 ?
                    (t.style.width = widthMobile, t.style.height = heightMobile) :
                    (t.style.width = widthDesktop, t.style.height = heightDesktop))
    }

    function start() {
        const allScriptsOnPage = document.getElementsByTagName("script");

        let stackAiScript = null;
        for (let scriptIndex = 0; scriptIndex < allScriptsOnPage.length; scriptIndex++)
            if (allScriptsOnPage[scriptIndex].src.includes("vanilla-stackai.js")) {
                stackAiScript = allScriptsOnPage[scriptIndex];
                break;
            }

        if (!stackAiScript) {
            console.error("Current script not found.");
            return;
        }

        const srcUrl = stackAiScript.getAttribute("data-project-url");
        if (!srcUrl) {
            console.error('Data attribute "data-project-url" not found in the script tag.');
            return;
        }

        const iframe = document.createElement("iframe");
        iframe.id = iframeId;
        iframe.src = srcUrl;
        iframe.style.position = "fixed";
        iframe.style.zIndex = "100";
        iframe.style.overflow = "hidden";
        iframe.style.bottom = "0";
        iframe.style.right = "0";
        iframe.style.border = "none";
        iframe.style.borderRadius = "10px";
        iframe.style.width = widthMobile;
        iframe.style.height = heightMobile;
        iframe.setAttribute("allow", "microphone");

        document.body.appendChild(iframe);

        return window.addEventListener("message", messageListener), function () {
            window.removeEventListener("message", messageListener);
            document.body.removeChild(iframe);
        }
    }

    start();
})();
