// transcription.js

document.addEventListener('DOMContentLoaded', function() {
    const baseUrl = window.location.hostname === 'localhost' ?
                    'http://127.0.0.1:8000' :
                    'https://app-orion-dev.azurewebsites.net';

    // Pega o botão para listar arquivos e adiciona um evento de clique
    document.getElementById('list-files').addEventListener('click', async function() {
        const folderId = document.getElementById('drive-folder-id').value.trim();

        if (!folderId) {
            alert('Por favor, insira o ID da pasta do Google Drive.');
            return;
        }

        // Chamada ao endpoint para listar arquivos usando POST com folder_id na URL
        try {
            const response = await fetch(`${baseUrl}/api/google/files-list?folder_id=${folderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            if (response.ok && result.status === 'success') {
                displayFileList(result.files);
            } else {
                alert('Falha ao obter a lista de arquivos.');
            }
        } catch (error) {
            console.error('Erro ao listar arquivos:', error);
            alert('Houve um erro ao tentar listar os arquivos. Consulte o console para mais detalhes.');
        }
    });

    // Pega o botão de transcrição de vídeos e adiciona um evento de clique
    document.getElementById('transcribe-videos').addEventListener('click', async function() {
        const fileListArea = document.getElementById('file-list');
        const files = fileListArea.value.trim();
        
        if (!files) {
            alert('Nenhum arquivo para transcrever.');
            return;
        }

        // Aqui, use o endpoint apropriado para enviar vídeos ao Azure Video Indexer
        try {
            const response = await fetch(`${baseUrl}/api/azure-datalake/upload-multiple-files`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ /* dados relevantes para a API */ })
            });

            const videoIds = await response.json();
            if (response.ok) {
                displayVideoIds(videoIds.dataFiles);
            } else {
                alert('Falha ao transcrever os vídeos.');
            }
        } catch (error) {
            console.error('Erro ao transcrever vídeos:', error);
            alert('Houve um erro ao tentar transcrever os vídeos. Consulte o console para mais detalhes.');
        }
    });

    function displayFileList(files) {
        const fileListArea = document.getElementById('file-list');
        fileListArea.value = Object.entries(files)
            .map(([fileName, fileId]) => `${fileName}: ${fileId}`)
            .join('\n');
    }

    function displayVideoIds(videoIds) {
        const videoIdsArea = document.getElementById('video-ids');
        videoIdsArea.value = videoIds.map(videoId => `ID: ${videoId}`).join('\n');
    }
});