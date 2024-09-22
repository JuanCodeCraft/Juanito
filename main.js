import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDMolsjFUtisMQK21heoXNrB-OyZb2JyGg",
  authDomain: "im2-project-capistrano.firebaseapp.com",
  projectId: "im2-project-capistrano",
  storageBucket: "im2-project-capistrano.appspot.com",
  messagingSenderId: "926803659069",
  appId: "1:926803659069:web:abc09d0d4513d030439d54"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "index.html"; // 1
  } else {
    displayUploadedFiles();
  }
});

document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html"; // 2
    })
    .catch((error) => {
      console.error("Error logging out: ", error);
    });
});

const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('upload-btn');
const uploadStatus = document.getElementById('upload-status');
const fileList = document.getElementById('uploaded-files');

uploadBtn.addEventListener('click', () => {
  fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) {
      uploadStatus.textContent = "Please choose a file to upload.";
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const storageRef = ref(storage, `uploads/${userId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          uploadStatus.textContent = `Upload is ${progress}% done`;
        }, 
        (error) => {
          console.error("Error uploading file:", error);
          uploadStatus.textContent = "Upload failed!";
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            uploadStatus.textContent = "Upload successful!";
            displayUploadedFiles();
          });
        }
      );
    }
  };
});

function displayUploadedFiles() {
  const user = auth.currentUser;
  if (!user) return;

  const userId = user.uid;
  const storageRef = ref(storage, `uploads/${userId}/`);

  listAll(storageRef)
    .then((result) => {
      fileList.innerHTML = ''; 
      result.items.forEach((fileRef) => {
        getDownloadURL(fileRef).then((url) => {
          const card = document.createElement('div');
          card.classList.add('file-card');

          const icon = document.createElement('i');
          icon.classList.add('file-icon', 'fas', 'fa-file'); 
          if (fileRef.name.endsWith('.jpg') || fileRef.name.endsWith('.png')) {
            icon.classList.add('fa-file-image');
          } else if (fileRef.name.endsWith('.pdf')) {
            icon.classList.add('fa-file-pdf');
          } else if (fileRef.name.endsWith('.docx')) {
            icon.classList.add('fa-file-word');
          }

          const a = document.createElement('a');
          a.href = url;
          a.textContent = fileRef.name;
          a.target = "_blank";

          card.appendChild(icon);
          card.appendChild(a);
          fileList.appendChild(card);
        });
      });
    })
    .catch((error) => {
      console.error("Error listing files:", error);
    });
}

window.onload = displayUploadedFiles;
