// Definir a URL base dinamicamente no início do código
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
const URL_API = isLocal 
    ? "http://127.0.0.1:8000/api/azure/extract_pdf_to_assistants" 
    : "https://app-orion-dev.azurewebsites.net/api/azure/extract_pdf_to_assistants";

    // Função para exibir o preloader
function showPreloader() {
    const preloader = document.getElementById("preloader1");
    preloader.style.opacity = "1";
    preloader.style.zIndex = "1050"; // Garante que o preloader fique acima de outros elementos
}

// Função para ocultar o preloader
function hidePreloader() {
    const preloader = document.getElementById("preloader1");
    preloader.style.opacity = "0";
    preloader.style.zIndex = "-1"; // Move o preloader para trás, tornando-o invisível
}
    
    
    document.getElementById("btnSubmit").addEventListener("click", async function(event) {
            // Previne o comportamento padrão de envio do formulário
            event.preventDefault();

            // Captura o arquivo do input
            const fileInput = document.getElementById("inp_file");
            const msg = document.getElementById("inp_textarea").value
            const file = fileInput.files[0];
            

     
            // Verifica se um arquivo foi selecionado
            if (!file) {
                console.error("Nenhum arquivo selecionado.");
                alert("Please, choise an file to send.");
                return;
            }

            // Exibir o preloader
            showPreloader();


            // Cria um objeto FormData e adiciona o arquivo e a descrição (se houver)
            const formData = new FormData();
            formData.append("file", file); // Nome do campo deve ser "file"
            formData.append("msg", msg);
     

            try {
                // Envia a requisição usando Fetch API
                const response = await fetch(URL_API, {
                    method: "POST",
                    body: formData
                });

        // Oculta o preloader após a resposta ser recebida
        document.getElementById("preloader1").display = "none";
        // Oculta o preloader após a resposta ser recebida
        
        hidePreloader();

        // Processa a resposta do servidor
        if (response.ok) {
            const result = await response.json();
            const extractedText = result;

            // Insere o texto extraído no div de resposta
            document.getElementById("responseContainer").innerHTML = extractedText;
            console.log("Texto extraído:", extractedText);
        } else {
            const errorText = await response.text();
            console.error("Erro no upload:", response.statusText, errorText);
            document.getElementById("responseContainer").innerText = "Erro no upload: " + errorText;
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        document.getElementById("responseContainer").innerText = "Erro ao enviar a requisição.";
    }
});
