import { db } from './config.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

window.cmsEditActivityTitle = async () => {
    const { value: title } = await Swal.fire({ title: 'Sửa Tiêu Đề', input: 'text', inputValue: window.cmsData.activity_data.title, showCancelButton: true, cancelButtonText: 'Hủy' });
    if(title) { window.cmsData.activity_data.title = title; await update(ref(db, 'pageContent/activity_data'), window.cmsData.activity_data); }
};

window.swalDelAct = async (idx) => {
    Swal.fire({ title: 'Xóa ảnh hoạt động này?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Đồng ý', cancelButtonText: 'Hủy' }).then(async (r) => {
        if(r.isConfirmed) {
            window.cmsData.activity_data.slides.splice(idx, 1);
            await update(ref(db, 'pageContent/activity_data'), window.cmsData.activity_data);
            let newList = '';
            window.cmsData.activity_data.slides.forEach((s, i) => {
                newList += `<tr><td>${i+1}</td><td class="text-start"><img src="${s.img}" style="width:30px; height:30px; object-fit:cover;" class="me-1 border rounded"><span class="small">${s.text ? s.text.substring(0, 20)+'...' : ''}</span></td><td><button type="button" class="btn btn-sm btn-danger py-0 px-1" onclick="window.swalDelAct(${i})"><i class="bi bi-trash"></i></button></td></tr>`;
            });
            document.getElementById('swal-act-tbody').innerHTML = newList;
        }
    });
};

window.cmsAddActivitySlide = async () => {
    let listHTML = '';
    if(window.cmsData.activity_data.slides) {
        window.cmsData.activity_data.slides.forEach((s, i) => {
            listHTML += `<tr><td>${i+1}</td><td class="text-start"><img src="${s.img}" style="width:30px; height:30px; object-fit:cover;" class="me-1 border rounded"><span class="small">${s.text ? s.text.substring(0, 20)+'...' : ''}</span></td><td><button type="button" class="btn btn-sm btn-danger py-0 px-1" onclick="window.swalDelAct(${i})"><i class="bi bi-trash"></i></button></td></tr>`;
        });
    }

    let leftCol = `
        <div class="text-start pe-2">
            <div class="text-center mb-2 d-none" id="preview-act-add-wrapper">
                <img id="preview-act-add-img" src="" style="max-height: 100px; border-radius: 8px; object-fit: cover;">
            </div>
            <label class="fw-bold mb-1 small">Link Ảnh HOẶC Tải ảnh từ máy:</label>
            <input id="swal-img-act-add" class="form-control form-control-sm mb-2" placeholder="Dán link ảnh...">
            <input id="swal-img-file-act-add" type="file" class="form-control form-control-sm mb-2" accept="image/*" onchange="encodeImageFileAsURLActAdd(this)">
            <input type="hidden" id="swal-img-b64-act-add" value="">
            <label class="fw-bold mb-1 small">Nội dung (chữ in nghiêng):</label>
            <textarea id="swal-text-act-add" class="form-control form-control-sm" style="height:80px;" placeholder="Nhập nội dung..."></textarea>
        </div>
    `;
    
    let rightCol = `
        <div class="text-start ps-2" style="max-height: 300px; overflow-y: auto;">
            <label class="fw-bold mb-2 text-primary small">Dữ liệu hiện tại:</label>
            <table class="table table-sm table-bordered table-hover">
                <thead class="table-light"><tr><th style="width:40px;">STT</th><th>Nội dung</th><th style="width:40px;">Xóa</th></tr></thead>
                <tbody id="swal-act-tbody">${listHTML}</tbody>
            </table>
        </div>
    `;
    
    let htmlFull = `<div class="row m-0"><div class="col-md-6 border-end p-0">${leftCol}</div><div class="col-md-6 p-0">${rightCol}</div></div>`;

    const { value: vals } = await Swal.fire({
        title: 'Quản Lý Ảnh Hoạt Động', width: '800px', html: htmlFull,
        showCancelButton: true, confirmButtonText: 'Thêm mới', cancelButtonText: 'Đóng',
        preConfirm: () => {
            let b64 = document.getElementById('swal-img-b64-act-add').value;
            let url = document.getElementById('swal-img-act-add').value;
            let finalImg = b64 ? b64 : url;
            if (!finalImg) { Swal.showValidationMessage('Vui lòng chọn ảnh từ máy hoặc dán link ảnh!'); return false; }
            return { img: finalImg, text: document.getElementById('swal-text-act-add').value };
        }
    });
    
    if(vals) {
        if(!window.cmsData.activity_data.slides) window.cmsData.activity_data.slides = [];
        window.cmsData.activity_data.slides.push(vals);
        await update(ref(db, 'pageContent/activity_data'), window.cmsData.activity_data);
        Swal.fire({toast:true, position:'top-end', icon:'success', title:'Đã thêm thành công!', showConfirmButton:false, timer:2000});
    }
};

window.cmsEditActivitySlide = async (i) => {
    let slide = window.cmsData.activity_data.slides[i];
    let imgHtml = `
        <div class="text-center mb-3">
            <label class="fw-bold d-block mb-2 text-primary">Ảnh hiện tại:</label>
            <img id="preview-act-img" src="${slide.img}" style="max-height: 120px; border-radius: 8px; object-fit: cover;">
        </div>
        <div class="mb-2 text-start mt-3"><label class="fw-bold">Thay thế (Dán Link HOẶC Tải ảnh mới):</label></div>
        <input id="swal-img-act" class="swal2-input mt-0 mb-2" placeholder="Dán link ảnh..." value="${slide.img || ''}">
        <input id="swal-img-file-act" type="file" class="form-control w-75 mx-auto mb-3" accept="image/*" onchange="encodeImageFileAsURLAct(this)">
        <input type="hidden" id="swal-img-b64-act" value="">`;
    const { value: vals } = await Swal.fire({
        title: 'Sửa Ảnh & Nội Dung',
        html: `${imgHtml}<div class="text-start mt-3"><label class="fw-bold">Nội dung (chữ in nghiêng):</label></div><textarea id="swal-text-act" class="swal2-textarea mt-0" placeholder="Nhập nội dung...">${slide.text || ''}</textarea>`,
        showCancelButton: true, confirmButtonText: 'Lưu thay đổi', cancelButtonText: 'Hủy',
        preConfirm: () => {
            let b64 = document.getElementById('swal-img-b64-act').value; let url = document.getElementById('swal-img-act').value;
            return { img: b64 ? b64 : url, text: document.getElementById('swal-text-act').value };
        }
    });
    if(vals) { window.cmsData.activity_data.slides[i] = vals; await update(ref(db, 'pageContent/activity_data'), window.cmsData.activity_data); Swal.fire({toast:true, position:'top-end', icon:'success', title:'Đã lưu!', showConfirmButton:false, timer:2000}); }
};

window.encodeImageFileAsURLAct = async function(element) { let file = element.files[0]; if(!file) return; Swal.showLoading(); try { let url = await window.uploadImageToGitHub(file); document.getElementById('swal-img-b64-act').value = ''; document.getElementById('swal-img-act').value = url; if(document.getElementById('preview-act-img')) document.getElementById('preview-act-img').src = url; } catch(e) { Swal.showValidationMessage(e); } Swal.hideLoading(); };
window.encodeImageFileAsURLActAdd = async function(element) { let file = element.files[0]; if(!file) return; Swal.showLoading(); try { let url = await window.uploadImageToGitHub(file); document.getElementById('swal-img-b64-act-add').value = ''; document.getElementById('swal-img-act-add').value = url; if(document.getElementById('preview-act-add-wrapper')) { document.getElementById('preview-act-add-wrapper').classList.remove('d-none'); document.getElementById('preview-act-add-img').src = url; } } catch(e) { Swal.showValidationMessage(e); } Swal.hideLoading(); };

window.cmsDeleteActivityBlock = async () => {
    Swal.fire({
        title: 'Xóa vĩnh viễn khối này?', 
        text: 'Khối Hình Ảnh Hoạt Động mặc định sẽ bị xóa đi.', 
        icon: 'warning', 
        showCancelButton: true,
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy'
    }).then(async (r) => {
        if (r.isConfirmed) {
            window.cmsData.activity_data.isDeleted = true;
            await update(ref(db, 'pageContent/activity_data'), window.cmsData.activity_data);
            Swal.fire('Đã xóa', '', 'success');
        }
    });
};