import { db } from './config.js';
import { ref, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// ====== CẤU HÌNH OPTION FORM ======
window.renderFormConfigOptions = () => {
    let agesHtml = ''; (window.cmsFormConfig.ages || []).forEach((age, i) => { agesHtml += `<div class="config-list-item"><span>${age}</span><button class="btn btn-sm btn-outline-danger py-1 px-2 border-0" onclick="window.delAgeOption(${i})"><i class="bi bi-trash"></i></button></div>`; }); if(document.getElementById('render_age_options')) document.getElementById('render_age_options').innerHTML = agesHtml;
    let coursesHtml = ''; (window.cmsFormConfig.courses || []).forEach((course, i) => { coursesHtml += `<div class="config-list-item"><span>${course}</span><button class="btn btn-sm btn-outline-danger py-1 px-2 border-0" onclick="window.delCourseOption(${i})"><i class="bi bi-trash"></i></button></div>`; }); if(document.getElementById('render_course_options')) document.getElementById('render_course_options').innerHTML = coursesHtml;
    let studyHtml = ''; (window.cmsFormConfig.studyModes || []).forEach((item, i) => { studyHtml += `<div class="config-list-item"><span>${item}</span><button class="btn btn-sm btn-outline-danger py-1 px-2 border-0" onclick="window.delStudyOption(${i})"><i class="bi bi-trash"></i></button></div>`; }); if(document.getElementById('render_study_options')) document.getElementById('render_study_options').innerHTML = studyHtml;
    let cityHtml = ''; (window.cmsFormConfig.cities || []).forEach((item, i) => { cityHtml += `<div class="config-list-item"><span>${item}</span><button class="btn btn-sm btn-outline-danger py-1 px-2 border-0" onclick="window.delCityOption(${i})"><i class="bi bi-trash"></i></button></div>`; }); if(document.getElementById('render_city_options')) document.getElementById('render_city_options').innerHTML = cityHtml;
};

window.updateFilterAgeDropdown = () => { 
    let select = document.getElementById('filterAge'); 
    if(!select) return;
    let currentVal = select.value; let html = `<option value="all">Tất cả</option>`; 
    (window.cmsFormConfig.ages || []).forEach(a => { html += `<option value="${a}">${a}</option>`; }); 
    select.innerHTML = html; select.value = currentVal; 
};

window.addAgeOption = () => { let val = document.getElementById('new_age_input').value.trim(); if(val) { if(!window.cmsFormConfig.ages) window.cmsFormConfig.ages = []; window.cmsFormConfig.ages.push(val); document.getElementById('new_age_input').value = ''; window.renderFormConfigOptions(); } };
window.delAgeOption = (i) => { window.cmsFormConfig.ages.splice(i, 1); window.renderFormConfigOptions(); };
window.addCourseOption = () => { let val = document.getElementById('new_course_input').value.trim(); if(val) { if(!window.cmsFormConfig.courses) window.cmsFormConfig.courses = []; window.cmsFormConfig.courses.push(val); document.getElementById('new_course_input').value = ''; window.renderFormConfigOptions(); } };
window.delCourseOption = (i) => { window.cmsFormConfig.courses.splice(i, 1); window.renderFormConfigOptions(); };
window.addStudyOption = () => { let val = document.getElementById('new_study_input').value.trim(); if(val) { if(!window.cmsFormConfig.studyModes) window.cmsFormConfig.studyModes = []; window.cmsFormConfig.studyModes.push(val); document.getElementById('new_study_input').value = ''; window.renderFormConfigOptions(); } };
window.delStudyOption = (i) => { window.cmsFormConfig.studyModes.splice(i, 1); window.renderFormConfigOptions(); };
window.addCityOption = () => { let val = document.getElementById('new_city_input').value.trim(); if(val) { if(!window.cmsFormConfig.cities) window.cmsFormConfig.cities = []; window.cmsFormConfig.cities.push(val); document.getElementById('new_city_input').value = ''; window.renderFormConfigOptions(); } };
window.delCityOption = (i) => { window.cmsFormConfig.cities.splice(i, 1); window.renderFormConfigOptions(); };

window.saveFormConfig = async () => { 
    await update(ref(db, 'pageContent/form_config'), window.cmsFormConfig); 
    Swal.fire({toast:true, position:'top-end', icon:'success', title:'Đã lưu Tùy chọn Form!', showConfirmButton:false, timer:2000}); 
    let fMod = bootstrap.Modal.getInstance(document.getElementById('formConfigModal')); 
    if(fMod) fMod.hide(); 
};

// ====== CẤU HÌNH MENU HEADER ======
window.renderMenuPreview = () => {
    let html = '';
    (window.cmsData.header_menu || []).forEach(m => {
        let icon = m.type === 'phone' ? '<i class="bi bi-telephone-fill me-1"></i>' : '';
        html += `<span class="badge px-3 py-2 fs-6 m-1" style="background-color: ${m.type==='phone'?'#e31837':'#112255'}; cursor:pointer;">${icon}${m.name}</span>`;
    });
    if(html === '') html = '<span class="text-muted fst-italic">Chưa có Menu nào</span>';
    if(document.getElementById('p_header_menu_render')) document.getElementById('p_header_menu_render').innerHTML = html;
};

window.renderMenuOptions = () => {
    let html = '';
    (window.cmsMenuConfig || []).forEach((m, i) => {
        let typeLabel = m.type === 'phone' ? '<i class="bi bi-telephone"></i> Chế độ gọi' : '<i class="bi bi-link-45deg"></i> Chế độ Link';
        let badgeColor = m.type === 'phone' ? 'bg-danger' : 'bg-primary';
        html += `
        <div class="config-list-item d-flex align-items-center justify-content-between p-2 mb-2 bg-white rounded shadow-sm border border-light">
            <div>
                <span class="fw-bold d-block text-dark mb-1">${m.name}</span>
                <span class="badge ${badgeColor} me-1">${typeLabel}</span><small class="text-muted">${m.value}</small>
            </div>
            <button class="btn btn-sm btn-outline-danger py-1 px-2 border-0" onclick="window.delMenuOption(${i})"><i class="bi bi-trash fs-5"></i></button>
        </div>`;
    });
    if(html === '') html = '<div class="text-muted text-center p-3">Chưa có menu nào</div>';
    if(document.getElementById('render_menu_options')) document.getElementById('render_menu_options').innerHTML = html;
};

window.openMenuModal = () => {
    window.cmsMenuConfig = JSON.parse(JSON.stringify(window.cmsData.header_menu || []));
    window.renderMenuOptions();
    let menuModal = document.getElementById('menuConfigModal');
    if(menuModal) new bootstrap.Modal(menuModal).show();
};

window.toggleMenuType = () => {
    let t = document.getElementById('new_menu_type').value;
    let v = document.getElementById('new_menu_val');
    if(t === 'phone') {
        v.placeholder = "Nhập Số điện thoại (VD: 0909123456)";
    } else {
        v.placeholder = "Nhập Link / ID vùng (VD: #wrap_about)";
    }
};

window.addMenuOption = () => {
    let name = document.getElementById('new_menu_name').value.trim();
    let type = document.getElementById('new_menu_type').value;
    let val = document.getElementById('new_menu_val').value.trim();
    if(!name || !val) {
        Swal.fire({toast:true, position:'top-end', icon:'warning', title:'Vui lòng nhập đủ Tên và Giá trị!', showConfirmButton:false, timer:2500});
        return;
    }
    window.cmsMenuConfig.push({ name: name, type: type, value: val });
    document.getElementById('new_menu_name').value = '';
    document.getElementById('new_menu_val').value = '';
    window.renderMenuOptions();
};

window.delMenuOption = (i) => {
    window.cmsMenuConfig.splice(i, 1);
    window.renderMenuOptions();
};

window.saveMenuConfig = async () => {
    window.cmsData.header_menu = window.cmsMenuConfig;
    await update(ref(db, 'pageContent'), { header_menu: window.cmsData.header_menu });
    Swal.fire({toast:true, position:'top-end', icon:'success', title:'Đã lưu Cấu Hình Menu!', showConfirmButton:false, timer:2000});
    let modal = bootstrap.Modal.getInstance(document.getElementById('menuConfigModal'));
    if(modal) modal.hide();
    window.renderMenuPreview();
};