export default class GalleryForm {
  constructor() {
    this.fileInput = document.getElementById('file-input');
    this.label = document.getElementsByClassName('image-form_label_text')[0];
    this.imgGallery = document.getElementsByClassName('image-gallery')[0];
  }

  insertImage(src) {
    const imgBlock = document.createElement('div');
    imgBlock.className = 'image_wrapper';

    const img = document.createElement('img');
    img.className = 'image_preview';
    img.src = src;
    img.addEventListener('load', () => {
      URL.revokeObjectURL(src);
    });

    imgBlock.innerHTML = `
      ${img.outerHTML}
      <button class="delete-image">×</button>
    `;
    this.imgGallery.appendChild(imgBlock);
  }

  validateFileType(file) {
    const fileTypes = ['jpeg', 'png', 'gif'];
    let { type } = file;
    type = type.split('/')[1];
    return fileTypes.includes(type);
  }

  fileInputChangeHandler() {
    const files = [...this.fileInput.files];
    const [file] = files;

    if (this.validateFileType(file)) {
      const src = URL.createObjectURL(file);
      this.insertImage(src);
    } else {
      console.log('Неправильный тип файла! А на модалку не хватило бюджета');
    }

    this.fileInput.value = '';
  }

  addEventListeners() {
    document.addEventListener('click', (e) => {
      const { target } = e;
      if (target.classList.contains('delete-image')) {
        const imgWrapper = target.closest('.image_wrapper');
        imgWrapper.remove();
      }
    });

    this.fileInput.addEventListener('change', () => {
      this.fileInputChangeHandler();
    });

    this.label.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    this.label.addEventListener('drop', (e) => {
      e.preventDefault();
      const { files } = e.dataTransfer;
      this.fileInput.files = files;
      this.fileInputChangeHandler();
    });
  }
}
