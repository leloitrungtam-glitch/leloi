import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

export const firebaseConfig = { apiKey: "AIzaSyA85V7th40ettZccP5or_tUNBE5_LRF1wU", authDomain: "test-web1-b1795.firebaseapp.com", databaseURL: "https://test-web1-b1795-default-rtdb.firebaseio.com", projectId: "test-web1-b1795" };
export const app = initializeApp(firebaseConfig); 
export const db = getDatabase(app);

window.GITHUB_CONFIG = {
    TOKEN: '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',
    OWNER: 'leloitrungtam-glitch',
    REPO: 'leloi',
    FOLDER: 'uploads',
    BRANCH: 'main'
};

window.uploadImageToGitHub = async (file) => {
    return new Promise((resolve, reject) => {
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
        const fileName = `${Date.now()}_${safeFileName}`;
        const filePath = window.GITHUB_CONFIG.FOLDER ? `${window.GITHUB_CONFIG.FOLDER}/${fileName}` : fileName;

        const reader = new FileReader();
        reader.onloadend = async function() {
            const base64Content = reader.result.split(',')[1];
            const url = `https://api.github.com/repos/${window.GITHUB_CONFIG.OWNER}/${window.GITHUB_CONFIG.REPO}/contents/${filePath}`;
            try {
                const response = await fetch(url, { method: 'PUT', headers: { 'Authorization': `token ${window.GITHUB_CONFIG.TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ message: `Auto upload image: ${fileName}`, content: base64Content, branch: window.GITHUB_CONFIG.BRANCH }) });
                if (response.ok) resolve(`https://raw.githubusercontent.com/${window.GITHUB_CONFIG.OWNER}/${window.GITHUB_CONFIG.REPO}/${window.GITHUB_CONFIG.BRANCH}/${filePath}`);
                else { const errorData = await response.json(); reject(`Lỗi GitHub API: ${errorData.message}`); }
            } catch (error) { reject(`Lỗi kết nối mạng: ${error.message}`); }
        };
        reader.readAsDataURL(file);
    });
};

window.handleSimpleUpload = async (element, targetInputId) => {
    let file = element.files[0]; if(!file) return; Swal.showLoading();
    try { let url = await window.uploadImageToGitHub(file); document.getElementById(targetInputId).value = url; } 
    catch (err) { Swal.showValidationMessage(err); } finally { Swal.hideLoading(); }
};