import { db } from './config.js';
import './crud_khachhang.js';
import './khoigiaovien.js';
import './khoillc.js';
import './crud_cauhinh.js';
import './crud_hoatdong.js';
import './crud_builder.js';
import { ref, onValue, get, child, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

window.cmsData = {}; window.cmsFormConfig = { ages: [], courses: [], studyModes: [], cities: [] }; window.cmsMenuConfig = [];

if (localStorage.getItem('isAdminLogged') === 'true') { 
    document.getElementById('login-section').style.display = 'none'; 
    document.getElementById('admin-section').style.display = 'block'; 
    document.getElementById('btn-hamburger').classList.remove('d-none'); 
    if(window.loadData) window.loadData(); 
}

let loginForm = document.getElementById('loginForm');
if(loginForm) { 
    loginForm.addEventListener('submit', async (e) => { 
        e.preventDefault(); 
        const u = document.getElementById('admin_user').value; 
        const p = document.getElementById('admin_password').value; 
        document.getElementById('login-loading').style.display = 'flex'; 
        try { 
            const snap = await get(child(ref(db), `admin`)); 
            if (snap.exists() && snap.val().tk === u && snap.val().mk === p) { 
                localStorage.setItem('isAdminLogged', 'true'); 
                document.getElementById('login-section').style.display = 'none'; 
                document.getElementById('admin-section').style.display = 'block'; 
                document.getElementById('btn-hamburger').classList.remove('d-none'); 
                if(window.loadData) window.loadData(); 
            } else { 
                Swal.fire({ icon: 'error', title: 'Sai tài khoản/mật khẩu' }); 
                document.getElementById('login-loading').style.display = 'none'; 
            } 
        } catch (err) { 
            Swal.fire({ icon: 'error', title: 'Lỗi mạng' }); 
            document.getElementById('login-loading').style.display = 'none'; 
        } 
    }); 
}

let btnLogout = document.getElementById('btnLogout'); 
if(btnLogout) { 
    btnLogout.addEventListener('click', () => { 
        localStorage.removeItem('isAdminLogged'); 
        location.reload(); 
    }); 
}

onValue(ref(db, 'pageContent'), (snap) => {
    if(snap.exists()) {
        window.cmsData = snap.val();
        
        if (!window.cmsData.header_menu) { window.cmsData.header_menu = [{ name: 'VỀ CHÚNG TÔI', type: 'link', value: '#wrap_about' }]; update(ref(db, 'pageContent'), { header_menu: window.cmsData.header_menu }); }
        if(window.renderMenuPreview) window.renderMenuPreview();

        if (!window.cmsData.news_data) { window.cmsData.news_data = { title: "LLC NEWS", slides: [{ img: "https://via.placeholder.com/800x600?text=News+Image+1" }] }; update(ref(db, 'pageContent'), { news_data: window.cmsData.news_data }); }
        if (!window.cmsData.about_data) { window.cmsData.about_data = { img: "https://via.placeholder.com/600x400?text=Anh+Minh+Hoa", title: "Tiêu đề khối giới thiệu", desc: "Nội dung mô tả giới thiệu chi tiết...", bgColor: "transparent", titleColor: "#112255", descColor: "#475569" }; update(ref(db, 'pageContent'), { about_data: window.cmsData.about_data }); }
        if (!window.cmsData.form_config) { window.cmsData.form_config = { ages: ["Mẫu giáo (4-6 tuổi)", "Tiểu học (6-11 tuổi)", "Cấp 2 (11-15 tuổi)", "Khác"], courses: ["Khối Thông Tin 1: Ứng Dụng AI", "Khối Thông Tin 1: Kỹ Sư ROBOCON", "Khối Thông Tin 1: Lập Trình MINECRAFT", "Khối Thông Tin 2 Mẫu Giáo", "Khối Thông Tin 2 Tiểu Học", "Khối Thông Tin 2 Cấp 2", "Chưa quyết định (Cần tư vấn thêm)"], studyModes: ["Học tại trung tâm", "Học Online", "Kèm 1-1"], cities: ["TP. Hồ Chí Minh", "Hà Nội", "Bình Thuận", "Tỉnh/Thành phố khác"] }; update(ref(db, 'pageContent'), { form_config: window.cmsData.form_config }); }
        if (!window.cmsData.form_config.studyModes) window.cmsData.form_config.studyModes = ["Học tại trung tâm", "Học Online"];
        if (!window.cmsData.form_config.cities) window.cmsData.form_config.cities = ["TP. Hồ Chí Minh", "Bình Thuận", "Khác"];
        
        window.cmsFormConfig = window.cmsData.form_config; 
        if(window.renderFormConfigOptions) window.renderFormConfigOptions(); 
        if(window.updateFilterAgeDropdown) window.updateFilterAgeDropdown();
        
        if (!window.cmsData.contact_data) { window.cmsData.contact_data = { phone: "028 7308 3333 (Phím 0)", messenger: "#", bgColor: "#4db8ff", btnSubmitBg: "#b86b62", btnMesBg: "#416f94", btnPhoneBg: "#ba5d6f" }; update(ref(db, 'pageContent'), { contact_data: window.cmsData.contact_data }); }
        if (window.cmsData.contact_data) {
            if(document.getElementById('p_contact_phone')) document.getElementById('p_contact_phone').innerText = window.cmsData.contact_data.phone;
            if(document.getElementById('link_messenger')) { document.getElementById('link_messenger').href = window.cmsData.contact_data.messenger; }
            if(document.getElementById('link_phone')) { let rawPhone = window.cmsData.contact_data.phone.replace(/[^0-9]/g, ''); document.getElementById('link_phone').href = "tel:" + rawPhone; }
            
            let styleTag = document.getElementById('dynamic-contact-style-admin'); 
            if (!styleTag) { styleTag = document.createElement('style'); styleTag.id = 'dynamic-contact-style-admin'; document.head.appendChild(styleTag); }
            let cBg = window.cmsData.contact_data.bgColor || '#4db8ff'; let cSubmit = window.cmsData.contact_data.btnSubmitBg || '#b86b62'; let cMes = window.cmsData.contact_data.btnMesBg || '#416f94'; let cPhone = window.cmsData.contact_data.btnPhoneBg || '#ba5d6f';
            
            styleTag.innerHTML = `
                #wrap_contact_form .container > .row > div { background-color: transparent !important; border: none !important; }
                #wrap_contact_form .container > .row > div > form, #wrap_contact_form .container > .row > div > div:first-child, #wrap_contact_form .container > .row > div > .bg-info { 
                    background-color: ${cBg} !important; border: 2px solid ${cBg} !important; border-radius: 20px !important;
                }
                #wrap_contact_form button[type="submit"], #form_footer button[type="submit"], #wrap_contact_form .btn-submit, #wrap_contact_form .btn-submit-dark { 
                    background-color: ${cSubmit} !important; border-color: ${cSubmit} !important; color: #ffffff !important; 
                }
                #link_messenger, #wrap_contact_form a[href*="facebook"], #wrap_contact_form a[href*="m.me"], #wrap_contact_form .row > div:nth-child(2) a:nth-of-type(1) {
                    background-color: ${cMes} !important; border-color: ${cMes} !important; color: #ffffff !important;
                }
                #link_phone, #wrap_contact_form a[href^="tel:"], #wrap_contact_form .row > div:nth-child(2) a:nth-of-type(2) {
                    background-color: ${cPhone} !important; border-color: ${cPhone} !important; color: #ffffff !important;
                }
            `;
        }

        if (!window.cmsData.custom_blocks) window.cmsData.custom_blocks = []; 
        if (!window.cmsData.activity_data) { window.cmsData.activity_data = { title: "HÌNH ẢNH HOẠT ĐỘNG", slides: [{ img: "https://via.placeholder.com/1200x600?text=Activity+Image", text: "Nội dung hình ảnh hoạt động..." }] }; update(ref(db, 'pageContent'), { activity_data: window.cmsData.activity_data }); }
        if (!window.cmsData.teacher_data) { window.cmsData.teacher_data = { title: "ĐỘI NGŨ GIẢNG VIÊN", icon: "bi-person-video3", color: "#00d5ff", cards: [] }; update(ref(db, 'pageContent'), { teacher_data: window.cmsData.teacher_data }); }

        if (!window.cmsData.visibility) { window.cmsData.visibility = { header: true, news: true, about: true, activity: true, teacher: true, intro: true, contact_form: true, footer: true }; update(ref(db, 'pageContent'), { visibility: window.cmsData.visibility }); }
        else { 
            let updatedVis = false;
            if(window.cmsData.visibility.news === undefined) { window.cmsData.visibility.news = true; updatedVis = true; }
            if(window.cmsData.visibility.about === undefined) { window.cmsData.visibility.about = true; updatedVis = true; }
            if(window.cmsData.visibility.activity === undefined) { window.cmsData.visibility.activity = true; updatedVis = true; }
            if(window.cmsData.visibility.teacher === undefined) { window.cmsData.visibility.teacher = true; updatedVis = true; }
            if(window.cmsData.visibility.contact_form === undefined) { window.cmsData.visibility.contact_form = true; updatedVis = true; }
            if(updatedVis) update(ref(db, 'pageContent/visibility'), window.cmsData.visibility); 
        }

        if (!window.cmsData.footer_data) { window.cmsData.footer_data = { logo: "https://media.leloipt.edu.vn/Media/30_TH1041/Images/footer-logo-leloi83f2a8da-5-e.png", name: "CÔNG TY CỔ PHẦN QUỐC TẾ ANH VĂN HỘI VIỆT MỸ", license: "Giấy chứng nhận doanh nghiệp số: 0313548147", address: "Trụ Sở Chính Tại 189 Nguyễn Thị Minh Khai, Phường Bến Thành, TP. Hồ Chí Minh", privacy: "Chính sách bảo vệ dữ liệu cá nhân", map_lat: "10.768820", map_lng: "106.688320", map_w: "100%", map_h: "150px" }; update(ref(db, 'pageContent'), { footer_data: window.cmsData.footer_data }); }
        
        /* LOGIC TẢI DỮ LIỆU MẠNG XÃ HỘI */
        if (!window.cmsData.footer_social) { 
            window.cmsData.footer_social = { text: "Follow LLC - Trung Tâm Ngoại Ngữ Lê Lợi, tại:", fb: { url: "#", visible: true }, yt: { url: "#", visible: true }, zl: { url: "#", visible: true }, tt: { url: "#", visible: true }, ig: { url: "#", visible: true } }; 
            update(ref(db, 'pageContent'), { footer_social: window.cmsData.footer_social }); 
        }
        if(window.cmsData.footer_social) {
            if(document.getElementById('p_footer_social_text')) document.getElementById('p_footer_social_text').innerText = window.cmsData.footer_social.text;
            let s = window.cmsData.footer_social;
            let sHtml = '';
            if(s.fb && s.fb.visible) sHtml += `<a href="${s.fb.url}" target="_blank" class="social-icon-btn fb" onclick="event.stopPropagation()"><i class="bi bi-facebook"></i></a>`;
            if(s.yt && s.yt.visible) sHtml += `<a href="${s.yt.url}" target="_blank" class="social-icon-btn yt" onclick="event.stopPropagation()"><i class="bi bi-youtube"></i></a>`;
            if(s.zl && s.zl.visible) sHtml += `<a href="${s.zl.url}" target="_blank" class="social-icon-btn zl" onclick="event.stopPropagation()"><span style="font-size: 13px; font-weight: bold;">Zalo</span></a>`;
            if(s.tt && s.tt.visible) sHtml += `<a href="${s.tt.url}" target="_blank" class="social-icon-btn tt" onclick="event.stopPropagation()"><i class="bi bi-tiktok"></i></a>`;
            if(s.ig && s.ig.visible) sHtml += `<a href="${s.ig.url}" target="_blank" class="social-icon-btn ig" onclick="event.stopPropagation()"><i class="bi bi-instagram"></i></a>`;
            if(document.getElementById('p_footer_social_icons')) document.getElementById('p_footer_social_icons').innerHTML = sHtml;
        }
        /* END LOGIC MẠNG XÃ HỘI */

        if(window.cmsData.footer_data) {
            const setFText = (id1, id2, val) => { if(document.getElementById(id1)) document.getElementById(id1).innerHTML = val || ''; if(document.getElementById(id2)) document.getElementById(id2).innerHTML = val || ''; };
            const setFImg = (id1, id2, val) => { if(document.getElementById(id1)) document.getElementById(id1).src = val || ''; if(document.getElementById(id2)) document.getElementById(id2).src = val || ''; };
            
            setFImg('p_footer_logo', 'f_logo', window.cmsData.footer_data.logo);
            setFText('p_footer_name', 'f_name', window.cmsData.footer_data.name);
            setFText('p_footer_license', 'f_license', window.cmsData.footer_data.license);
            setFText('p_footer_address', 'f_address', window.cmsData.footer_data.address);
            setFText('p_footer_privacy', 'f_privacy', window.cmsData.footer_data.privacy);
            
            let mapEl = document.getElementById('p_footer_map') || document.getElementById('f_map');
            if(mapEl && window.cmsData.footer_data.map_lat && window.cmsData.footer_data.map_lng) { 
                mapEl.src = `https://maps.google.com/maps?q=${window.cmsData.footer_data.map_lat},${window.cmsData.footer_data.map_lng}&hl=vi&z=16&output=embed`; 
                mapEl.style.width = window.cmsData.footer_data.map_w || '100%'; 
                mapEl.style.height = window.cmsData.footer_data.map_h || '150px'; 
            }
        }

        const applyVis = (id, key) => { let el = document.getElementById(id); if(el) { if(!window.cmsData.visibility[key]) el.classList.add('is-hidden-section'); else el.classList.remove('is-hidden-section'); } };
        applyVis('wrap_header', 'header'); applyVis('wrap_news', 'news'); applyVis('wrap_about', 'about'); applyVis('wrap_activity', 'activity'); applyVis('wrap_intro', 'intro'); applyVis('wrap_contact_form', 'contact_form'); applyVis('wrap_footer', 'footer');

        const setT = (id) => { if(document.getElementById('p_'+id)) document.getElementById('p_'+id).innerHTML = window.cmsData[id]||'...'; }; const setI = (id) => { if(document.getElementById('p_'+id)) document.getElementById('p_'+id).src = window.cmsData[id]||''; };
        setI('logo'); setT('site_title'); setT('sec1_title'); setT('sec1_desc');
        
        if(window.cmsData.intro_bg_color) document.getElementById('cms_intro_bg_preview').style.backgroundColor = window.cmsData.intro_bg_color; else document.getElementById('cms_intro_bg_preview').style.backgroundColor = 'transparent';

        if(document.getElementById('cms_news_render')) {
            let newsHTML = '';
            if(window.cmsData.news_data.slides) {
                window.cmsData.news_data.slides.forEach((s, i) => {
                    newsHTML += `<div class="swiper-slide" style="width:250px;"><div class="position-relative w-100" onclick="event.stopPropagation()"><div class="cms-actions" style="top: 10px; right: 10px; z-index: 10; display:flex;"><button onclick="window.cmsEditNewsSlide(${i})" class="btn btn-sm btn-primary py-1 px-2"><i class="bi bi-pencil"></i> Sửa</button><button onclick="window.swalDelNewsDirect(${i})" class="btn btn-sm btn-danger py-1 px-2 ms-1"><i class="bi bi-trash"></i></button></div><img src="${s.img || 'https://via.placeholder.com/800x600'}" style="width: 100%; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); object-fit: contain;"></div></div>`;
                });
            }
            document.getElementById('cms_news_render').innerHTML = newsHTML;
        }

        if(document.getElementById('p_about_img')) document.getElementById('p_about_img').src = window.cmsData.about_data.img || 'https://via.placeholder.com/600x400';
        if(document.getElementById('p_about_title')) { document.getElementById('p_about_title').innerText = window.cmsData.about_data.title || 'Tiêu Đề'; document.getElementById('p_about_title').style.color = window.cmsData.about_data.titleColor || '#112255'; }
        if(document.getElementById('p_about_desc')) { document.getElementById('p_about_desc').innerHTML = window.cmsData.about_data.desc || 'Mô tả...'; document.getElementById('p_about_desc').style.color = window.cmsData.about_data.descColor || '#475569'; }
        if(document.getElementById('cms_about_bg')) document.getElementById('cms_about_bg').style.backgroundColor = window.cmsData.about_data.bgColor || 'transparent';

        let wrapActAdmin = document.getElementById('wrap_activity');
        if (wrapActAdmin) {
            if (window.cmsData.activity_data && window.cmsData.activity_data.isDeleted) {
                wrapActAdmin.style.display = 'none';
            } else {
                wrapActAdmin.style.display = 'block';
                if(document.getElementById('p_activity_title')) document.getElementById('p_activity_title').innerText = window.cmsData.activity_data.title || "HÌNH ẢNH HOẠT ĐỘNG";
                let actHTML = '';
                if(window.cmsData.activity_data.slides) {
                    window.cmsData.activity_data.slides.forEach((s, i) => {
                        actHTML += `<div class="swiper-slide"><div class="position-relative w-100" onclick="event.stopPropagation()"><div class="cms-actions" style="top: 15px; right: 15px; z-index: 10;"><button onclick="window.cmsEditActivitySlide(${i})" class="btn btn-sm btn-primary"><i class="bi bi-pencil"></i> Sửa</button></div><img src="${s.img || 'https://via.placeholder.com/1200x600'}" class="activity-slide-img"><p class="activity-slide-text">${s.text || 'Nội dung...'}</p></div></div>`;
                    });
                }
                if(document.getElementById('cms_activity_render')) document.getElementById('cms_activity_render').innerHTML = actHTML;
            }
        }

        if(document.getElementById('p_teacher_title_global')) document.getElementById('p_teacher_title_global').innerText = window.cmsData.teacher_data.title || "ĐỘI NGŨ GIẢNG VIÊN";
        let gtbColor = window.cmsData.teacher_data.color || '#00d5ff';
        let gtbIcon = window.cmsData.teacher_data.icon || 'bi-person-video3';
        let wg = document.getElementById('wrap_teacher_global');
        if(wg) {
            if (window.cmsData.teacher_data.isDeleted) { wg.style.display = 'none'; } else {
                wg.style.display = 'block'; wg.style.borderColor = gtbColor;
                let st = wg.querySelector('.sm-toolbar'); if(st) st.style.background = gtbColor;
                let ei = document.getElementById('p_teacher_icon_global'); if(ei) className = `bi ${gtbIcon}`;
                let eh = wg.querySelector('.editable-block'); if(eh) eh.style.color = gtbColor;
                if(!window.cmsData.visibility['teacher']) wg.classList.add('is-hidden-section'); else wg.classList.remove('is-hidden-section');
            }
        }

        let globalTeacherHTML = '';
        if(window.cmsData.teacher_data.cards && !window.cmsData.teacher_data.isDeleted) {
            window.cmsData.teacher_data.cards.forEach((c, cIndex) => {
                let badgeHTML = c.hideExperience ? '' : `<div class="teacher-badge"><span>+${c.experience || '0'}</span><small>năm<br>kinh nghiệm</small></div>`; 
                globalTeacherHTML += `<div class="swiper-slide"><div class="cms-card-wrapper teacher-card" onclick="event.stopPropagation();" style="border-color: ${c.bgColor||'#00d5ff'} !important;"><div class="cms-actions"><button onclick="event.stopPropagation(); window.cmsEditTeacherCard(${cIndex}, null)" class="btn btn-sm btn-primary"><i class="bi bi-pencil"></i> Sửa</button><button onclick="event.stopPropagation(); window.cmsDeleteTeacherCard(${cIndex}, null)" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button></div>${badgeHTML}<img src="${c.img || 'https://via.placeholder.com/400x500?text=Teacher'}" class="teacher-img"><div class="teacher-info" style="background-color: ${c.bgColor||'#00d5ff'};"><div class="teacher-role" style="color: ${c.roleColor||'#112255'};">${c.role || 'Chức vụ'}</div><h4 class="teacher-name" style="color: ${c.nameColor||'#112255'};">${c.name || 'TÊN GIÁO VIÊN'}</h4></div></div></div>`;
            });
        }
        if(document.getElementById('cms_global_teacher_render')) document.getElementById('cms_global_teacher_render').innerHTML = globalTeacherHTML;

        let renderTop = '', renderMid1 = '', renderMid2 = '', renderBottom = '';
        window.cmsData.custom_blocks.forEach((block, bIndex) => {
            let isHidClass = block.isHidden ? 'is-hidden-section' : '';
            let masterToolbar = `<div class="sm-toolbar bg-success" style="z-index: 100;"><button onclick="window.cmsToggleVisBlock(${bIndex}); event.stopPropagation();"><i class="bi bi-eye"></i> ${block.isHidden ? 'Hiện Lại' : 'Ẩn Khối'}</button> <span class="mx-1">|</span> <button onclick="window.cmsDeleteBlock(${bIndex}); event.stopPropagation();"><i class="bi bi-trash"></i> Xóa Khối</button> <span class="badge bg-dark ms-2" style="cursor:pointer;" onclick="window.cmsEditSlug(${bIndex}); event.stopPropagation();" title="Click để sửa"><i class="bi bi-pencil-square"></i> Điểm neo: #${block.slug || 'chua-co'}</span></div>`;
            let dbHTML = '';
            
            if(block.type === 'text' || !block.type) { 
                let textToolbar = `<div class="sm-toolbar bg-success" style="z-index: 100;"><button onclick="window.cmsToggleVisBlock(${bIndex}); event.stopPropagation();"><i class="bi bi-eye"></i> ${block.isHidden ? 'Hiện Lại' : 'Ẩn Khối'}</button> <span class="mx-1">|</span> <button onclick="window.cmsEditCustomBlock(${bIndex}); event.stopPropagation();"><i class="bi bi-pencil"></i> Sửa Box</button> <span class="mx-1">|</span> <button onclick="window.cmsDeleteBlock(${bIndex}); event.stopPropagation();"><i class="bi bi-trash"></i> Xóa Khối</button> <span class="badge bg-dark ms-2" style="cursor:pointer;" onclick="window.cmsEditSlug(${bIndex}); event.stopPropagation();" title="Click để sửa"><i class="bi bi-pencil-square"></i> Điểm neo: #${block.slug || 'chua-co'}</span></div>`;
                let bgStyle = block.isTransparent ? 'transparent' : (block.bgColor || '#e0f2fe'); let shadowStyle = block.hasShadow === false ? 'none' : '0 5px 15px rgba(0,0,0,0.05)'; let borderStyle = (block.isTransparent && block.hasShadow === false) ? '1px dashed #ccc' : '2px dashed transparent';
                dbHTML = `<div id="${block.slug || 'block-'+block.id}" class="section-master ${isHidClass} editable-block" style="background-color: ${bgStyle}; color: ${block.textColor}; padding: 30px; box-shadow: ${shadowStyle}; border: ${borderStyle}" onclick="window.cmsEditCustomBlock(${bIndex})">${textToolbar}<div class="edit-btn-overlay"><i class="bi bi-pencil"></i></div>${block.content}</div>`; 
            } 
            else if(block.type === 'tech') { 
                let innerCards = ''; if(block.cards) { block.cards.forEach((c, cIndex) => { 
                    let detailBtnHtml = c.has_detail ? `<button type="button" class="btn btn-sm w-100 fw-bold mt-2" style="background-color: ${c.detail_bg || '#3866f0'}; color: ${c.detail_color || '#ffffff'}; font-family: ${c.detail_font || 'Inter'}, sans-serif; font-size: ${c.detail_size || '14'}px; border-radius: 50px;">${c.detail_text || 'Xem chi tiết'}</button>` : '';
                    innerCards += `<div class="col-md-4"><div class="cms-card-wrapper course-card" onclick="event.stopPropagation();" style="border-top-color: ${c.color};"><div class="cms-actions"><button onclick="event.stopPropagation(); window.cmsEditCard('tech', ${cIndex}, ${bIndex})" class="btn btn-sm btn-primary"><i class="bi bi-pencil"></i> Sửa</button><button onclick="event.stopPropagation(); window.cmsDeleteCard('tech', ${cIndex}, ${bIndex})" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button></div><img src="${c.img || 'https://via.placeholder.com/800x400'}" class="course-card-img"><div class="icon-box" style="background: ${c.color}20; color: ${c.color};"><i class="bi ${c.icon || 'bi-star'}"></i></div><h3 class="course-title">${c.title || 'Tiêu đề thẻ'}</h3><p class="course-desc flex-grow-1">${c.desc || 'Mô tả ngắn gọn...'}</p><div class="px-3 pb-2 mt-auto"><button type="button" class="btn btn-sm w-100 fw-bold" style="background-color: #f15a3a; color: white; border-radius: 50px; padding: 8px;">TƯ VẤN NGAY <i class="bi bi-telephone-fill" style="background: white; color: #f15a3a; padding: 2px 6px; border-radius: 50%; margin-left: 5px;"></i></button>${detailBtnHtml}</div></div></div>`; 
                }); } 
                let bColor = block.color || '#f15a3a'; let bIcon = block.icon || 'bi-card-checklist'; let bBg = block.bgColor || 'transparent';
                dbHTML = `<div id="${block.slug || 'block-'+block.id}" class="section-master ${isHidClass}" style="border-color:${bColor};">${masterToolbar}<div class="section-master-header" style="border-bottom-color: ${bColor};"><h5 class="sm-title editable-block p-1 m-0" onclick="window.cmsEditBlockTitle(${bIndex})" style="color:${bColor};"><i class="bi ${bIcon}"></i> ${block.title||'Khối Thông Tin 1'}</h5><button class="btn btn-sm btn-outline-danger" onclick="window.cmsAddCard('tech', ${bIndex})"><i class="bi bi-plus-circle"></i> Thêm Thẻ Mới</button></div><div class="p-3 rounded-4" style="background-color: ${bBg};"><div class="row g-4 justify-content-center">${innerCards}</div></div></div>`; 
            }
            else if(block.type === 'english') { 
                let innerCards = ''; if(block.cards) { block.cards.forEach((c, cIndex) => { 
                    let detailBtnHtml = c.has_detail ? `<button type="button" class="btn btn-sm w-100 fw-bold mt-2" style="background-color: ${c.detail_bg || '#3866f0'}; color: ${c.detail_color || '#ffffff'}; font-family: ${c.detail_font || 'Inter'}, sans-serif; font-size: ${c.detail_size || '14'}px; border-radius: 50px;">${c.detail_text || 'Xem chi tiết'}</button>` : '';
                    innerCards += `<div class="col-md-4"><div class="cms-card-wrapper ep-card" onclick="event.stopPropagation();" style="background-color: ${c.bg_color || '#ffffff'};"><div class="cms-actions"><button onclick="event.stopPropagation(); window.cmsEditCard('english', ${cIndex}, ${bIndex})" class="btn btn-sm btn-dark"><i class="bi bi-pencil"></i> Sửa</button><button onclick="event.stopPropagation(); window.cmsDeleteCard('english', ${cIndex}, ${bIndex})" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button></div><div class="ep-header"><h3 class="ep-title" style="color: ${c.text_color || '#000000'};">${c.title || 'Tiêu đề thẻ'}</h3><div class="ep-age-badge" style="background-color: ${c.text_color || '#000000'}; color: #fff;"><span>Từ</span><strong>${c.age || '0'}</strong><span>tuổi</span></div></div><img src="${c.img || 'https://via.placeholder.com/800x600'}" class="ep-img"><p class="ep-desc" style="color: ${c.text_color || '#000000'};">${c.desc || 'Mô tả chi tiết lớp học...'}</p><div class="mt-auto pt-2 w-100"><button type="button" class="btn btn-sm w-100 fw-bold" style="background-color: #f15a3a; color: white; border-radius: 50px; padding: 8px;">TƯ VẤN NGAY <i class="bi bi-telephone-fill" style="background: white; color: #f15a3a; padding: 2px 6px; border-radius: 50%; margin-left: 5px;"></i></button>${detailBtnHtml}</div></div></div>`; 
                }); } 
                let bColor = block.color || '#112255'; let bIcon = block.icon || 'bi-book'; let bBg = block.bgColor || '#00d5ff';
                dbHTML = `<div id="${block.slug || 'block-'+block.id}" class="section-master ${isHidClass}" style="border-color:${bColor};">${masterToolbar}<div class="section-master-header" style="border-bottom-color: ${bColor};"><h5 class="sm-title editable-block p-1 m-0" onclick="window.cmsEditBlockTitle(${bIndex})" style="color:${bColor};"><i class="bi ${bIcon}"></i> ${block.title||'Khối Thông Tin 2'}<div class="edit-btn-overlay"><i class="bi bi-pencil"></i></div></h5><button class="btn btn-sm btn-outline-info text-dark fw-bold" onclick="window.cmsAddCard('english', ${bIndex})"><i class="bi bi-plus-circle"></i> Thêm Lớp Mới</button></div><div class="p-4 rounded-4 editable-block-blue" style="background-color: ${bBg};" onclick="window.cmsEditBlockTitle(${bIndex})"><div class="edit-btn-overlay-blue"><i class="bi bi-palette"></i></div><div class="row g-4 justify-content-center">${innerCards}</div></div></div>`; 
            }
            else if(block.type === 'teacher') {
                let tbColor = block.color || '#00d5ff'; let tbIcon = block.icon || 'bi-person-video3';
                let innerCards = ''; if(block.cards) { block.cards.forEach((c, cIndex) => { let badgeHTML = c.hideExperience ? '' : `<div class="teacher-badge"><span>+${c.experience || '0'}</span><small>năm<br>kinh nghiệm</small></div>`; innerCards += `<div class="swiper-slide"><div class="cms-card-wrapper teacher-card" onclick="event.stopPropagation();" style="border-color: ${c.bgColor||'#00d5ff'} !important;"><div class="cms-actions"><button onclick="event.stopPropagation(); window.cmsEditTeacherCard(${cIndex}, ${bIndex})" class="btn btn-sm btn-primary"><i class="bi bi-pencil"></i> Sửa</button><button onclick="event.stopPropagation(); window.cmsDeleteTeacherCard(${cIndex}, ${bIndex})" class="btn btn-sm btn-danger"><i class="bi bi-trash"></i></button></div>${badgeHTML}<img src="${c.img || 'https://via.placeholder.com/400x500?text=Teacher'}" class="teacher-img"><div class="teacher-info" style="background-color: ${c.bgColor||'#00d5ff'};"><div class="teacher-role" style="color: ${c.roleColor||'#112255'};">${c.role || 'Chức vụ'}</div><h4 class="teacher-name" style="color: ${c.nameColor||'#112255'};">${c.name || 'TÊN GIÁO VIÊN'}</h4></div></div></div>`; }); }
                dbHTML = `<div id="${block.slug || 'block-'+block.id}" class="section-master ${isHidClass}" style="border-color:${tbColor};">${masterToolbar}<div class="section-master-header" style="border-bottom-color: ${tbColor};"><h5 class="sm-title editable-block p-1 m-0" onclick="window.cmsEditTeacherTitle(${bIndex})" style="color:${tbColor};"><i class="bi ${tbIcon}"></i> ${block.title||'Đội Ngũ Giảng Viên'}<div class="edit-btn-overlay"><i class="bi bi-pencil"></i></div></h5><button class="btn btn-sm btn-outline-info text-dark fw-bold" onclick="window.cmsAddTeacherCard(${bIndex})"><i class="bi bi-plus-circle"></i> Quản lý Giáo Viên</button></div><div class="p-3 rounded-4" style="background-color: transparent;"><div class="swiper teacherSwiper-${bIndex} teacherSwiper"><div class="swiper-wrapper">${innerCards}</div><div class="swiper-pagination"></div></div></div></div>`;
            }
            else if (block.type === 'news') {
                let nColor = block.color || '#ff9800';
                let innerSlides = '';
                if(block.slides) {
                    block.slides.forEach((s, sIndex) => {
                        innerSlides += `<div class="swiper-slide" style="width:200px;"><div class="position-relative w-100" onclick="event.stopPropagation()">
                            <div class="cms-actions" style="top: 5px; right: 5px; z-index: 10; display:flex;"><button onclick="event.stopPropagation(); window.cmsEditCustomNewsSlide(${sIndex}, ${bIndex})" class="btn btn-sm btn-primary py-1 px-2"><i class="bi bi-pencil"></i></button><button onclick="event.stopPropagation(); window.swalDelCustomNewsDirect(${sIndex}, ${bIndex})" class="btn btn-sm btn-danger py-1 px-2 ms-1"><i class="bi bi-trash"></i></button></div>
                            <img src="${s.img || 'https://via.placeholder.com/800x600'}" style="width: 100%; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); object-fit: contain;">
                        </div></div>`;
                    });
                }
                dbHTML = `<div id="${block.slug || 'block-'+block.id}" class="section-master ${isHidClass}" style="border-color:${nColor}; background: #f8fafc;">${masterToolbar}<div class="text-center mb-4 editable-block" onclick="window.cmsEditBlockTitle(${bIndex})"><h3 class="fw-bold" style="color: ${nColor}; text-transform: uppercase;">${block.title}</h3><div style="width: 50px; height: 3px; background-color: ${nColor}; margin: 10px auto;"></div><div class="edit-btn-overlay"><i class="bi bi-pencil"></i></div></div><div class="position-relative p-2"><div class="text-center mb-3"><button class="btn btn-sm btn-outline-warning text-dark fw-bold" onclick="window.cmsAddCustomNewsSlide(${bIndex})"><i class="bi bi-plus-circle"></i> Quản lý Ảnh NEWS</button></div><div class="swiper customNewsSwiper-${bIndex}" style="padding-bottom: 30px;"><div class="swiper-wrapper">${innerSlides}</div><div class="swiper-pagination"></div></div></div></div>`;
            }

            let dropZoneHtml = `<div class="drop-zone mini-drop" ondrop="window.dropHandlerBetween(event, ${bIndex})" ondragover="window.allowDrop(event)" ondragleave="window.dragLeave(event)" ondragenter="window.allowDrop(event)"><i class="bi bi-arrow-down-circle"></i> Thả khối mới vào giữa đây</div>`;
            if(block.pos === 'pos-top') { renderTop += dbHTML + dropZoneHtml; }
            else if(block.pos === 'pos-mid1') { renderMid1 += dbHTML + dropZoneHtml; }
            else if(block.pos === 'pos-mid2') { renderMid2 += dbHTML + dropZoneHtml; }
            else { renderBottom += dbHTML + dropZoneHtml; }
        }); 
        if(document.getElementById('render_pos_top')) document.getElementById('render_pos_top').innerHTML = renderTop;
        if(document.getElementById('render_pos_mid1')) document.getElementById('render_pos_mid1').innerHTML = renderMid1;
        if(document.getElementById('render_pos_mid2')) document.getElementById('render_pos_mid2').innerHTML = renderMid2;
        if(document.getElementById('render_pos_bottom')) document.getElementById('render_pos_bottom').innerHTML = renderBottom;

        setTimeout(() => {
            if (window.newsSwiperPreviewInstance) window.newsSwiperPreviewInstance.destroy(true, true);
            window.newsSwiperPreviewInstance = new Swiper('.newsSwiperPreview', { slidesPerView: 2, spaceBetween: 20, observer: true, observeParents: true, pagination: { el: '.swiper-pagination', clickable: true } });

            if (window.activitySwiperInstance) window.activitySwiperInstance.destroy(true, true);
            window.activitySwiperInstance = new Swiper('.activitySwiper', { slidesPerView: 1, spaceBetween: 20, observer: true, observeParents: true, autoplay: { delay: 2000, disableOnInteraction: false }, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } });

            if (window.globalTeacherSwiperInstance) window.globalTeacherSwiperInstance.destroy(true, true);
            window.globalTeacherSwiperInstance = new Swiper('.globalTeacherSwiper', { slidesPerView: 1, spaceBetween: 20, centeredSlides: true, loop: true, initialSlide: 0, observer: true, observeParents: true, autoplay: { delay: 2000, disableOnInteraction: false }, pagination: { el: '.swiper-pagination', clickable: true }, breakpoints: { 768: { slidesPerView: 3, spaceBetween: 30 } } });

            window.cmsData.custom_blocks.forEach((block, bIndex) => {
                if(block.type === 'teacher') {
                    if(window[`teacherSwiperInstance_${bIndex}`]) window[`teacherSwiperInstance_${bIndex}`].destroy(true, true);
                    window[`teacherSwiperInstance_${bIndex}`] = new Swiper(`.teacherSwiper-${bIndex}`, { slidesPerView: 1, spaceBetween: 20, centeredSlides: true, loop: true, initialSlide: 0, observer: true, observeParents: true, autoplay: { delay: 2000, disableOnInteraction: false }, pagination: { el: '.swiper-pagination', clickable: true }, breakpoints: { 768: { slidesPerView: 3, spaceBetween: 30 } } });
                }
                if (block.type === 'news') {
                    if(window[`customNewsSwiperInstance_${bIndex}`]) window[`customNewsSwiperInstance_${bIndex}`].destroy(true, true);
                    window[`customNewsSwiperInstance_${bIndex}`] = new Swiper(`.customNewsSwiper-${bIndex}`, { slidesPerView: 2, spaceBetween: 20, observer: true, observeParents: true, pagination: { el: '.swiper-pagination', clickable: true } });
                }
            });
        }, 100);
    }
});

if ('WebSocket' in window) {
    (function () {
        function refreshCSS() {
            var sheets = [].slice.call(document.getElementsByTagName("link"));
            var head = document.getElementsByTagName("head")[0];
            for (var i = 0; i < sheets.length; ++i) {
                var elem = sheets[i];
                var parent = elem.parentElement || head;
                parent.removeChild(elem);
                var rel = elem.rel;
                if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
                    var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
                    elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
                }
                parent.appendChild(elem);
            }
        }
        var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
        var address = protocol + window.location.host + window.location.pathname + '/ws';
        var socket = new WebSocket(address);
        socket.onmessage = function (msg) {
            if (msg.data == 'reload') window.location.reload();
            else if (msg.data == 'refreshcss') refreshCSS();
        };
        if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {
            console.log('Live reload enabled.');
            sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
        }
    })();
}