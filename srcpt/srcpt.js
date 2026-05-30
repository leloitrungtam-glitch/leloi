if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }
window.scrollTo(0, 0);
window.addEventListener('beforeunload', function () { window.scrollTo(0, 0); });

// Đã thêm mirror: true để hiệu ứng có thể reset khi cuộn ngược lên
AOS.init({ duration: 800, once: false, mirror: true, offset: 50 });

// --- BẮT ĐẦU CODE SỬA LỖI CLICK MENU ÉP CHẠY LẠI ANIMATION ---
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
        const targetId = link.getAttribute('href').substring(1);
        if(targetId) {
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                // Xóa và thêm lại animation cho khối chính
                if (targetEl.hasAttribute('data-aos')) {
                    targetEl.classList.remove('aos-animate');
                    setTimeout(() => { targetEl.classList.add('aos-animate'); }, 150);
                }
                // Xóa và thêm lại animation cho các khối con bên trong (nếu có)
                const aosChildren = targetEl.querySelectorAll('[data-aos]');
                aosChildren.forEach(child => {
                    child.classList.remove('aos-animate');
                    setTimeout(() => { child.classList.add('aos-animate'); }, 150);
                });
            }
        }
    }
});
// --- KẾT THÚC CODE SỬA LỖI ---

const backToTopBtn = document.getElementById("backToTopBtn");
window.addEventListener("scroll", () => { if (window.scrollY > 400) { backToTopBtn.style.display = "flex"; } else { backToTopBtn.style.display = "none"; } });
backToTopBtn.addEventListener("click", () => { window.scrollTo({ top: 0, behavior: "smooth" }); });
window.addEventListener('load', () => { setTimeout(() => { const loader = document.getElementById('page-loader'); if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 500); } }, 1500); });

window.showDetailModal = (encodedContent) => {
    const modalBody = document.getElementById('detailModalBody');
    modalBody.style.opacity = '0';
    modalBody.style.transform = 'translateY(15px)';
    modalBody.innerHTML = decodeURIComponent(encodedContent);
    let detailModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('detailModal'));
    detailModal.show();
    setTimeout(() => {
        modalBody.style.transition = 'all 0.4s ease';
        modalBody.style.opacity = '1';
        modalBody.style.transform = 'translateY(0)';
    }, 150);
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, push, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const firebaseConfig = { apiKey: "AIzaSyA85V7th40ettZccP5or_tUNBE5_LRF1wU", authDomain: "test-web1-b1795.firebaseapp.com", databaseURL: "https://test-web1-b1795-default-rtdb.firebaseio.com", projectId: "test-web1-b1795" };
const app = initializeApp(firebaseConfig); const db = getDatabase(app);

// MẢNG LƯU TRỮ SWIPER ĐỂ TIÊU DIỆT SẠCH SẼ KHI DỮ LIỆU ĐỔI (CHỐNG KẸT/ĐỨNG YÊN)
window.cmsSwipers = window.cmsSwipers || [];

onValue(ref(db, 'pageContent'), (snapshot) => {
    if(snapshot.exists()){
        const data = snapshot.val();
        
        // 1. DỌN SẠCH CÁC SWIPER CŨ ĐANG CHẠY NGẦM ĐỂ TRÁNH XUNG ĐỘT
        if (window.cmsSwipers.length > 0) {
            window.cmsSwipers.forEach(s => {
                try { s.destroy(true, true); } catch(e) {}
            });
            window.cmsSwipers = [];
        }
        
        try {
            if (data.header_menu) {
                let dNav = ''; let mNav = '';
                data.header_menu.forEach(m => {
                    if (m.type === 'phone') {
                        let phoneNum = m.value.replace(/[^0-9]/g, '');
                        dNav += `<a href="tel:${phoneNum}" class="btn-phone-menu"><i class="bi bi-telephone-fill"></i> ${m.name}</a>`;
                        mNav += `<a href="tel:${phoneNum}" class="mobile-menu-link phone-link"><i class="bi bi-telephone-fill"></i> ${m.name}</a>`;
                    } else {
                        dNav += `<a href="${m.value}">${m.name}</a>`;
                        mNav += `<a href="${m.value}" class="mobile-menu-link" onclick="bootstrap.Offcanvas.getInstance(document.getElementById('mobileMenu')).hide();">${m.name}</a>`;
                    }
                });
                if(document.getElementById('desktop_nav')) document.getElementById('desktop_nav').innerHTML = dNav;
                if(document.getElementById('mobile_nav_render')) document.getElementById('mobile_nav_render').innerHTML = mNav;
            }

            if (data.form_config) {
                const config = data.form_config;
                const renderOptions = (elId, list, defaultText) => {
                    const el = document.getElementById(elId);
                    if (!el) return;
                    let html = `<option value="" disabled selected>${defaultText}</option>`;
                    (list || []).forEach(item => { html += `<option value="${item}"> ${item}</option>`; });
                    el.innerHTML = html;
                };
                renderOptions('p_age', config.ages, "Chọn độ tuổi"); renderOptions('p_study', config.studyModes, "Chọn hình thức học"); renderOptions('p_course', config.courses, "Khóa học đăng ký"); renderOptions('p_city', config.cities, "Tỉnh/ Thành phố");
                renderOptions('f_study', config.studyModes, "Hình thức học"); renderOptions('f_city', config.cities, "Tỉnh/ Thành phố"); renderOptions('f_age', config.ages, "Độ tuổi *"); renderOptions('f_course', config.courses, "Khóa học đăng ký *");
            }

            if (data.contact_data) {
                if(document.getElementById('display_phone')) document.getElementById('display_phone').innerText = data.contact_data.phone;
                if(document.getElementById('link_messenger')) document.getElementById('link_messenger').href = data.contact_data.messenger;
                if(document.getElementById('link_phone')) { let rawPhone = data.contact_data.phone.replace(/[^0-9]/g, ''); document.getElementById('link_phone').href = "tel:" + rawPhone; }
                
                let styleTag = document.getElementById('dynamic-contact-style-index'); 
                if (!styleTag) { styleTag = document.createElement('style'); styleTag.id = 'dynamic-contact-style-index'; document.head.appendChild(styleTag); }
                let cBg = data.contact_data.bgColor || '#4db8ff'; let cSubmit = data.contact_data.btnSubmitBg || '#b86b62'; let cMes = data.contact_data.btnMesBg || '#416f94'; let cPhone = data.contact_data.btnPhoneBg || '#ba5d6f';
                
                styleTag.innerHTML = `#wrap_contact_form .container > .row > div { background-color: transparent !important; border: none !important; } #wrap_contact_form .container > .row > div > form, #wrap_contact_form .container > .row > div > div:first-child, #wrap_contact_form .container > .row > div > .bg-info { background-color: ${cBg} !important; border: 2px solid ${cBg} !important; border-radius: 20px !important; } #wrap_contact_form button[type="submit"], #form_footer button[type="submit"], #wrap_contact_form .btn-submit, #wrap_contact_form .btn-submit-dark { background-color: ${cSubmit} !important; border-color: ${cSubmit} !important; color: #ffffff !important; } #link_messenger, #wrap_contact_form a[href*="facebook"], #wrap_contact_form a[href*="m.me"], #wrap_contact_form .row > div:nth-child(2) a:nth-of-type(1) { background-color: ${cMes} !important; border-color: ${cMes} !important; color: #ffffff !important; } #link_phone, #wrap_contact_form a[href^="tel:"], #wrap_contact_form .row > div:nth-child(2) a:nth-of-type(2) { background-color: ${cPhone} !important; border-color: ${cPhone} !important; color: #ffffff !important; }`;
            }

            if (data.visibility) {
                const applyVis = (elId, key) => { const el = document.getElementById(elId); if (el) el.style.display = data.visibility[key] ? '' : 'none'; };
                applyVis('wrap_header', 'header'); applyVis('wrap_hero', 'header'); applyVis('wrap_news', 'news'); applyVis('wrap_about', 'about'); applyVis('wrap_activity', 'activity'); applyVis('wrap_intro', 'intro'); applyVis('wrap_global_tech', 'global_tech'); applyVis('wrap_global_english', 'global_english'); applyVis('wrap_global_teacher', 'global_teacher'); applyVis('wrap_contact_form', 'contact_form'); applyVis('wrap_footer', 'footer');
            }
            
            // --- LOGIC ẢNH BÌA HERO (ĐÃ LỌC BỎ CODE CŨ) ---
            let fetchedBgs = [];
            if(data.hero_images && data.hero_images.length > 0) {
                 fetchedBgs = data.hero_images;
            } else {
                 if(data.hero_bg_1 && data.hero_bg_1.trim() !== "") fetchedBgs.push(data.hero_bg_1); 
                 if(data.hero_bg_2 && data.hero_bg_2.trim() !== "") fetchedBgs.push(data.hero_bg_2); 
                 if(data.hero_bg_3 && data.hero_bg_3.trim() !== "") fetchedBgs.push(data.hero_bg_3);
            }
            
            const heroRender = document.getElementById('hero_render');
            let heroSection = document.getElementById('wrap_hero');
            if(fetchedBgs.length === 0) { 
                if(heroSection) heroSection.style.display = 'none'; 
            } else { 
                if(heroSection) heroSection.style.display = 'block'; 
                if(heroRender) {
                    let hHtml = '';
                    fetchedBgs.forEach(bg => {
                        hHtml += `<div class="swiper-slide" style="background-image: url('${bg}'); background-size: cover; background-position: center; background-repeat: no-repeat; width: 100%; height: 100%;"></div>`;
                    });
                    heroRender.innerHTML = hHtml;
                }
            }
            
            const updateHTML = (id, value) => { if(value && document.getElementById(id)) document.getElementById(id).innerHTML = value; };
            const updateIMG = (id, value) => { if(value && document.getElementById(id)) document.getElementById(id).src = value; };

            updateIMG('cms_logo', data.logo); updateIMG('loader_img', data.logo); updateHTML('cms_site_title', data.site_title); updateHTML('cms_sec1_title', data.sec1_title); updateHTML('cms_sec1_desc', data.sec1_desc);

            if (data.news_data && document.getElementById('news_render')) {
                document.getElementById('cms_news_title').innerText = data.news_data.title || "LLC NEWS";
                let nHTML = '';
                if (data.news_data.slides) { data.news_data.slides.forEach(s => { if(s) nHTML += `<div class="swiper-slide"><img src="${s.img || ''}" class="news-img-card" alt="News Image"></div>`; }); }
                document.getElementById('news_render').innerHTML = nHTML;
            }

            if (data.about_data && document.getElementById('wrap_about')) {
                updateIMG('p_about_img', data.about_data.img); updateHTML('p_about_title', data.about_data.title); updateHTML('p_about_desc', data.about_data.desc);
                const abTitle = document.getElementById('p_about_title'); if (abTitle) abTitle.style.color = data.about_data.titleColor || '#112255';
                const abDesc = document.getElementById('p_about_desc'); if (abDesc) abDesc.style.color = data.about_data.descColor || '#475569';
                const abBg = document.getElementById('cms_about_bg'); if (abBg) abBg.style.backgroundColor = data.about_data.bgColor || 'transparent';
            }

            let wrapActIndex = document.getElementById('wrap_activity');
            if (data.activity_data && data.activity_data.isDeleted) {
                if (wrapActIndex) wrapActIndex.style.display = 'none';
            } else if (data.activity_data && document.getElementById('activity_render')) {
                if (wrapActIndex) wrapActIndex.style.display = 'block'; document.getElementById('cms_activity_title').innerText = data.activity_data.title || "HÌNH ẢNH HOẠT ĐỘNG";
                let actHTML = ''; if(data.activity_data.slides) { data.activity_data.slides.forEach(s => { if(s) actHTML += `<div class="swiper-slide"><div class="w-100"><img src="${s.img || ''}" class="activity-slide-img"><p class="activity-slide-text">${s.text || ''}</p></div></div>`; }); } document.getElementById('activity_render').innerHTML = actHTML;
            }

            const techContainer = document.getElementById('tech_cards_container');
            if(data.tech_cards && techContainer) {
                techContainer.innerHTML = '';
                data.tech_cards.forEach((card, index) => { 
                    if(card) {
                        let btnDetail = card.has_detail ? `<div class="px-4 pb-3 mt-auto"><button type="button" class="btn w-100 btn-detail" style="background-color: ${card.detail_bg||'#3866f0'}; color: ${card.detail_color||'#ffffff'}; font-size: ${card.detail_size||'14'}px; font-family: ${card.detail_font||'Inter'}, sans-serif;" data-content="${encodeURIComponent(card.detail_content || 'Nội dung chi tiết đang cập nhật...')}" onclick="window.showDetailModal(this.getAttribute('data-content'))">${card.detail_text||'Xem chi tiết'}</button></div>` : '';
                        techContainer.innerHTML += `<div class="swiper-slide"><div class="course-card"><div style="background-color: ${card.color}; height: 5px; width: 100%; position: absolute; top: 0; left: 0; z-index: 10;"></div><img src="${card.img}" class="course-card-img"><div class="icon-box" style="color: ${card.color}; border: 2px solid ${card.color}30;"><i class="bi ${card.icon}"></i></div><h3 class="course-title">${card.title}</h3><p class="course-desc">${card.desc}</p><div class="px-4 pb-2 mt-auto"><button type="button" class="btn w-100 fw-bold" style="background-color: #f15a3a; color: white; border-radius: 50px; padding: 10px;" data-bs-toggle="modal" data-bs-target="#registrationModal">TƯ VẤN NGAY <i class="bi bi-telephone-fill" style="background: white; color: #f15a3a; padding: 2px 6px; border-radius: 50%; margin-left: 5px;"></i></button></div>${btnDetail}</div></div>`; 
                    }
                });
            }

            const englishContainer = document.getElementById('english_cards_container'); const englishSection = document.getElementById('wrap_global_english');
            if(data.english_bg_color && englishSection) englishSection.style.backgroundColor = data.english_bg_color;
            if(data.english_cards && englishContainer) {
                englishContainer.innerHTML = '';
                data.english_cards.forEach((card, index) => { 
                    if(card) {
                        let btnDetail = card.has_detail ? `<button type="button" class="btn w-100 mt-2 btn-detail" style="background-color: ${card.detail_bg||'#3866f0'}; color: ${card.detail_color||'#ffffff'}; font-size: ${card.detail_size||'14'}px; font-family: ${card.detail_font||'Inter'}, sans-serif;" data-content="${encodeURIComponent(card.detail_content || 'Nội dung chi tiết đang cập nhật...')}" onclick="window.showDetailModal(this.getAttribute('data-content'))">${card.detail_text||'Xem chi tiết'}</button>` : '';
                        englishContainer.innerHTML += `<div class="swiper-slide"><div class="ep-card" style="background-color: ${card.bg_color || '#ffffff'};"><div class="ep-header"><h3 class="ep-title" style="color: ${card.text_color || '#112255'};">${card.title}</h3><div class="ep-age-badge" style="background-color: rgb(255, 75, 15);"><span style="color:#ffffff!important;">Từ</span><strong style="color:#ffffff!important;">${card.age}</strong><span style="color:#ffffff!important;">tuổi</span></div></div><img src="${card.img}" class="ep-img"><p class="ep-desc" style="color: ${card.text_color || '#475569'};">${card.desc}</p><div class="mt-auto"><button type="button" class="ep-btn" style="background-color: #f15a3a; color: #fff;" data-bs-toggle="modal" data-bs-target="#registrationModal">TƯ VẤN NGAY <i class="bi bi-telephone-fill" style="color: #f15a3a; background-color: #fff;"></i></button>${btnDetail}</div></div></div>`; 
                    }
                });
            }

            if(data.teacher_config && document.getElementById('cms_teacher_title')) { const tc = data.teacher_config; document.getElementById('cms_teacher_title').innerHTML = `<i class="bi ${tc.icon}"></i> ${tc.title}`; document.getElementById('cms_teacher_title').style.color = tc.color; }
            if(data.teacher_cards && document.getElementById('global_teacher_render')) {
                let tHTML = '';
                data.teacher_cards.forEach((c) => {
                    if(c) {
                        let badgeHTML = c.hideExperience ? '' : `<div class="teacher-badge"><span>+${c.experience}</span><small>năm<br>kinh nghiệm</small></div>`;
                        tHTML += `<div class="swiper-slide"><div class="teacher-card" style="border-color: ${c.bgColor||'#00d5ff'} !important;">${badgeHTML}<img src="${c.img}" class="teacher-img"><div class="teacher-info" style="background-color: ${c.bgColor||'#00d5ff'};"><div class="teacher-role" style="color: ${c.roleColor||'#112255'};">${c.role}</div><h4 class="teacher-name" style="color: ${c.nameColor||'#112255'};">${c.name}</h4></div></div></div>`;
                    }
                });
                document.getElementById('global_teacher_render').innerHTML = tHTML;
            }

            let renderTop = '', renderMid1 = '', renderMid2 = '', renderBottom = '';
            if (data.custom_blocks) {
                data.custom_blocks.forEach((block, bIndex) => {
                    if (block && !block.isHidden) {
                        let dbHTML = '';
                        if (block.type === 'text' || !block.type) { 
                            let bgStyle = block.isTransparent ? 'transparent' : (block.bgColor || '#e0f2fe'); let shadowStyle = block.hasShadow === false ? 'none' : '0 5px 15px rgba(0,0,0,0.05)'; let padStyle = (block.isTransparent && block.hasShadow === false) ? '15px 0' : '30px';
                            dbHTML = `<div id="${block.slug || 'block-'+block.id}" class="custom-text-box" data-aos="fade-up" style="background-color: ${bgStyle}; color: ${block.textColor}; padding: ${padStyle}; border-radius: 20px; box-shadow: ${shadowStyle}; margin-bottom: 30px;">${block.content}</div>`; 
                        } 
                        else if (block.type === 'tech') { 
                            let innerCards = ''; 
                            if(block.cards) { 
                                block.cards.forEach((c, i) => { 
                                    if(c) {
                                        let btnDetail = c.has_detail ? `<div class="px-4 pb-3 mt-auto"><button type="button" class="btn w-100 btn-detail" style="background-color: ${c.detail_bg||'#3866f0'}; color: ${c.detail_color||'#ffffff'}; font-size: ${c.detail_size||'14'}px; font-family: ${c.detail_font||'Inter'}, sans-serif;" data-content="${encodeURIComponent(c.detail_content || 'Nội dung chi tiết đang cập nhật...')}" onclick="window.showDetailModal(this.getAttribute('data-content'))">${c.detail_text||'Xem chi tiết'}</button></div>` : '';
                                        innerCards += `<div class="swiper-slide"><div class="course-card"><div style="background-color: ${c.color}; height: 5px; width: 100%; position: absolute; top: 0; left: 0; z-index: 10;"></div><img src="${c.img}" class="course-card-img"><div class="icon-box" style="color: ${c.color}; border: 2px solid ${c.color}30;"><i class="bi ${c.icon}"></i></div><h3 class="course-title">${c.title}</h3><p class="course-desc">${c.desc}</p><div class="px-4 pb-2 mt-auto"><button type="button" class="btn w-100 fw-bold" style="background-color: #f15a3a; color: white; border-radius: 50px; padding: 10px;" data-bs-toggle="modal" data-bs-target="#registrationModal">TƯ VẤN NGAY <i class="bi bi-telephone-fill" style="background: white; color: #f15a3a; padding: 2px 6px; border-radius: 50%; margin-left: 5px;"></i></button></div>${btnDetail}</div></div>`; 
                                    }
                                }); 
                            } 
                            let bColor = block.color || '#f15a3a'; let bIcon = block.icon || 'bi-card-checklist';
                            dbHTML = `<div id="${block.slug || 'block-'+block.id}" data-aos="fade-up" class="mb-5"><div class="section-heading mb-4" style="text-align: left;"><h2 style="color: ${bColor}; font-size: 32px;"><i class="bi ${bIcon}"></i> ${block.title || 'Khối Thông Tin 1'}</h2></div><div class="swiper customTechSwiper-${bIndex} techSwiper"><div class="swiper-wrapper">${innerCards}</div><div class="swiper-pagination"></div></div></div>`; 
                        }
                        else if (block.type === 'english') { 
                            let innerCards = ''; 
                            if(block.cards) { 
                                block.cards.forEach((c, i) => { 
                                    if(c) {
                                        let btnDetail = c.has_detail ? `<button type="button" class="btn w-100 mt-2 btn-detail" style="background-color: ${c.detail_bg||'#3866f0'}; color: ${c.detail_color||'#ffffff'}; font-size: ${c.detail_size||'14'}px; font-family: ${c.detail_font||'Inter'}, sans-serif;" data-content="${encodeURIComponent(c.detail_content || 'Nội dung chi tiết đang cập nhật...')}" onclick="window.showDetailModal(this.getAttribute('data-content'))">${c.detail_text||'Xem chi tiết'}</button>` : '';
                                        innerCards += `<div class="swiper-slide"><div class="ep-card" style="background-color: ${c.bg_color || '#ffffff'};"><div class="ep-header"><h3 class="ep-title" style="color: ${c.text_color || '#112255'};">${c.title}</h3><div class="ep-age-badge" style="background-color: rgb(255, 75, 15);"><span style="color:#ffffff!important;">Từ</span><strong style="color:#ffffff!important;">${c.age}</strong><span style="color:#ffffff!important;">tuổi</span></div></div><img src="${c.img}" class="ep-img"><p class="ep-desc" style="color: ${c.text_color || '#475569'};">${c.desc}</p><div class="mt-auto"><button type="button" class="ep-btn" style="background-color: #f15a3a; color: #fff;" data-bs-toggle="modal" data-bs-target="#registrationModal">TƯ VẤN NGAY <i class="bi bi-telephone-fill" style="color: #f15a3a; background-color: #fff;"></i></button>${btnDetail}</div></div></div>`; 
                                    }
                                }); 
                            } 
                            let bColor = block.color || '#112255'; let bIcon = block.icon || 'bi-book'; let bBg = block.bgColor || '#00d5ff';
                            dbHTML = `<div id="${block.slug || 'block-'+block.id}" class="english-programs-section mb-5" style="background-color: ${bBg};" data-aos="fade-up"><div class="section-heading mb-4" style="margin-bottom: 30px; text-align: left; border-bottom: 2px dashed #cbd5e1; padding-bottom: 15px;"><h2 style="color: ${bColor}; font-size: 32px; margin-bottom: 0;"><i class="bi ${bIcon}"></i> ${block.title || 'Khối Thông Tin 2'}</h2></div><div class="swiper customEnglishSwiper-${bIndex} englishSwiper"><div class="swiper-wrapper">${innerCards}</div><div class="swiper-pagination"></div></div></div>`; 
                        }
                        else if (block.type === 'teacher') {
                            let tbColor = block.color || '#00d5ff'; let tbIcon = block.icon || 'bi-person-video3';
                            let innerCards = ''; 
                            if(block.cards) { 
                                block.cards.forEach((c) => { 
                                    if(c) {
                                        let badgeHTML = c.hideExperience ? '' : `<div class="teacher-badge"><span>+${c.experience}</span><small>năm<br>kinh nghiệm</small></div>`; 
                                        innerCards += `<div class="swiper-slide"><div class="teacher-card" style="border-color: ${c.bgColor||'#00d5ff'} !important;">${badgeHTML}<img src="${c.img}" class="teacher-img"><div class="teacher-info" style="background-color: ${c.bgColor||'#00d5ff'};"><div class="teacher-role" style="color: ${c.roleColor||'#112255'};">${c.role}</div><h4 class="teacher-name" style="color: ${c.nameColor||'#112255'};">${c.name}</h4></div></div></div>`; 
                                    }
                                }); 
                            }
                            dbHTML = `<div id="${block.slug || 'block-'+block.id}" class="mb-5" data-aos="fade-up"><div class="section-heading mb-4"><h2 style="color:${tbColor}; font-size: 32px;"><i class="bi ${tbIcon}"></i> ${block.title||'Đội Ngũ Giảng Viên'}</h2></div><div class="swiper customTeacherSwiper-${bIndex} teacherSwiper"><div class="swiper-wrapper">${innerCards}</div><div class="swiper-pagination"></div></div></div>`;
                        }
                        else if (block.type === 'news') {
                            let nColor = block.color || '#ff9800';
                            let innerSlides = '';
                            if(block.slides) { block.slides.forEach((s) => { if(s) innerSlides += `<div class="swiper-slide"><img src="${s.img || ''}" class="news-img-card" alt="News Image"></div>`; }); }
                            dbHTML = `<div id="${block.slug || 'block-'+block.id}" class="news-section mb-5" data-aos="fade-up" style="background-color: transparent; padding: 0;"><div class="section-heading mb-4"><h2 style="color: ${nColor}; font-weight: 800; font-size: 24px; text-transform: uppercase;">${block.title || 'LLC NEWS'}</h2><div style="width: 40px; height: 3px; background-color: ${nColor}; margin: 0 auto; border-radius: 2px;"></div></div><div class="swiper customNewsSwiper-${bIndex} newsSwiper"><div class="swiper-wrapper">${innerSlides}</div><div class="swiper-pagination"></div></div></div>`;
                        }

                        if(block.pos === 'pos-top') renderTop += dbHTML; else if(block.pos === 'pos-mid1') renderMid1 += dbHTML; else if(block.pos === 'pos-mid2') renderMid2 += dbHTML; else renderBottom += dbHTML;
                    }
                });
            }
            document.getElementById('render_pos_top').innerHTML = renderTop; document.getElementById('render_pos_mid1').innerHTML = renderMid1; document.getElementById('render_pos_mid2').innerHTML = renderMid2; document.getElementById('render_pos_bottom').innerHTML = renderBottom;

            if(data.footer_data) { 
                updateIMG('f_logo', data.footer_data.logo); updateHTML('f_name', data.footer_data.name); updateHTML('f_license', data.footer_data.license); updateHTML('f_address', data.footer_data.address); updateHTML('f_privacy', data.footer_data.privacy); 
                const mapEl = document.getElementById('f_map'); 
                if(mapEl && data.footer_data.map_lat && data.footer_data.map_lng) { mapEl.src = `https://maps.google.com/maps?q=${data.footer_data.map_lat},${data.footer_data.map_lng}&hl=vi&z=16&output=embed&iwloc=near`; mapEl.style.width = data.footer_data.map_w || '100%'; mapEl.style.height = data.footer_data.map_h || '150px'; } 
            }
            
            if (data.footer_social && document.getElementById('footer_social_render')) {
                let s = data.footer_social;
                let sHtml = '';
                if(s.fb && s.fb.visible) sHtml += `<a href="${s.fb.url}" target="_blank" class="social-icon-btn fb"><i class="bi bi-facebook"></i></a>`;
                if(s.yt && s.yt.visible) sHtml += `<a href="${s.yt.url}" target="_blank" class="social-icon-btn"><i class="bi bi-youtube"></i></a>`;
                if(s.zl && s.zl.visible) sHtml += `<a href="${s.zl.url}" target="_blank" class="social-icon-btn"><span class="zalo-text">Zalo</span></a>`;
                if(s.tt && s.tt.visible) sHtml += `<a href="${s.tt.url}" target="_blank" class="social-icon-btn"><i class="bi bi-tiktok"></i></a>`;
                if(s.ig && s.ig.visible) sHtml += `<a href="${s.ig.url}" target="_blank" class="social-icon-btn"><i class="bi bi-instagram"></i></a>`;
                
                if (sHtml !== '') {
                    document.getElementById('footer_social_render').innerHTML = `
                        <div class="footer-social-card" data-aos="fade-up">
                            <div class="footer-social-text">${s.text || 'Follow LLC - Trung Tâm Ngoại Ngữ Lê Lợi, tại:'}</div>
                            <div class="social-icons-wrapper">
                                ${sHtml}
                            </div>
                        </div>
                    `;
                } else {
                    document.getElementById('footer_social_render').innerHTML = '';
                }
            }

            // 2. KHỞI TẠO LẠI CÁC SWIPER VỚI CẤU HÌNH CHUẨN ĐỂ ĐẢM BẢO CHẠY MƯỢT VÀ LUÔN NẰM GIỮA
            setTimeout(() => { 
                // CẤU HÌNH RIÊNG CHUẨN CHO KHỐI GIÁO VIÊN/HỌC VIÊN
                const teacherConfig = {
                    slidesPerView: 1, 
                    spaceBetween: 20, 
                    centeredSlides: true, 
                    loop: false, 
                    rewind: true,
                    //loopedSlides: 6, // RẤT QUAN TRỌNG: Khắc phục lỗi thiếu thẻ khi lặp làm hỏng canh giữa
                    speed: 800, // Chuyển cảnh mềm mại không bị giật
                    slideToClickedSlide: true,
                    observer: true, 
                    observeParents: true, 
                    autoplay: { delay: 1200, disableOnInteraction: false }, 
                    pagination: { el: '.swiper-pagination', clickable: true }, 
                    breakpoints: { 768: { slidesPerView: 3, spaceBetween: 30 } }
                };

                // CẤU HÌNH CHO KHỐI KHÓA HỌC/TIẾNG ANH
                const standardConfig = {
                    slidesPerView: 1, 
                    spaceBetween: 20, 
                    loop: true, 
                    loopedSlides: 6,
                    speed: 800,
                    slideToClickedSlide: true, 
                    observer: true, 
                    observeParents: true,
                    autoplay: { delay: 3500, disableOnInteraction: false }, 
                    pagination: { el: '.swiper-pagination', clickable: true }, 
                    breakpoints: { 768: { slidesPerView: 2, spaceBetween: 20 }, 1024: { slidesPerView: 3, spaceBetween: 30 } }
                };

                window.cmsSwipers.push(new Swiper('.heroSwiper', { 
                    slidesPerView: 1, loop: true, slideToClickedSlide: true, speed: 800,
                    autoplay: { delay: 4000, disableOnInteraction: false }, 
                    pagination: { el: '.hero-indicators', clickable: true } 
                }));
                
                window.cmsSwipers.push(new Swiper('.newsSwiper', { 
                    effect: 'coverflow', grabCursor: true, centeredSlides: true, slidesPerView: 'auto', 
                    loop: true, loopedSlides: 6, slideToClickedSlide: true, speed: 800,
                    autoplay: { delay: 3000, disableOnInteraction: false }, 
                    coverflowEffect: { rotate: 20, stretch: 0, depth: 100, modifier: 1.5, slideShadows: false }, 
                    pagination: { el: '.swiper-pagination', clickable: true } 
                }));
                
                window.cmsSwipers.push(new Swiper('.activitySwiper', { 
                    slidesPerView: 1, spaceBetween: 20, loop: true, slideToClickedSlide: true, speed: 800,
                    autoplay: { delay: 2000, disableOnInteraction: false }, 
                    pagination: { el: '.swiper-pagination', clickable: true }, 
                    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } 
                }));
                
                window.cmsSwipers.push(new Swiper('.globalTeacherSwiper', teacherConfig));
                window.cmsSwipers.push(new Swiper('.globalTechSwiper', standardConfig));
                window.cmsSwipers.push(new Swiper('.globalEnglishSwiper', standardConfig));
                
                if (data.custom_blocks) {
                    data.custom_blocks.forEach((block, bIndex) => {
                        if(block && block.type === 'teacher') {
                            window.cmsSwipers.push(new Swiper(`.customTeacherSwiper-${bIndex}`, teacherConfig));
                        } else if (block && block.type === 'tech') {
                            window.cmsSwipers.push(new Swiper(`.customTechSwiper-${bIndex}`, standardConfig));
                        } else if (block && block.type === 'english') {
                            window.cmsSwipers.push(new Swiper(`.customEnglishSwiper-${bIndex}`, standardConfig));
                        } else if (block && block.type === 'news') {
                            window.cmsSwipers.push(new Swiper(`.customNewsSwiper-${bIndex}`, { 
                                effect: 'coverflow', grabCursor: true, centeredSlides: true, slidesPerView: 'auto', 
                                loop: true, loopedSlides: 6, slideToClickedSlide: true, speed: 800,
                                autoplay: { delay: 3000, disableOnInteraction: false }, 
                                coverflowEffect: { rotate: 20, stretch: 0, depth: 100, modifier: 1.5, slideShadows: false }, 
                                pagination: { el: '.swiper-pagination', clickable: true } 
                            }));
                        }
                    });
                }
                AOS.refresh(); 
            }, 300); // Khởi tạo sau khi HTML render xong
        } catch (error) { console.error("Đã xảy ra lỗi:", error); }
    }
});

const submitRegistration = async (formData) => {
    document.getElementById('loading').style.display = 'flex';
    try { await push(ref(db, "registrations"), { ...formData, timestamp: serverTimestamp() }); document.getElementById('loading').style.display = 'none'; const modalEl = document.getElementById('registrationModal'); const modal = bootstrap.Modal.getInstance(modalEl); if (modal) modal.hide(); Swal.fire({ title: '✨ Thành công!', html: `Cảm ơn phụ huynh <b>${formData.parentName}</b> với SĐT <b>${formData.phone}</b>, trung tâm sẽ liên hệ vào giây lát.`, icon: 'success' }); } catch (error) { document.getElementById('loading').style.display = 'none'; Swal.fire('Lỗi!', 'Không thể gửi dữ liệu, vui lòng thử lại.', 'error'); }
};
document.getElementById('form_popup').addEventListener('submit', function(e) { e.preventDefault(); const data = { parentName: document.getElementById('p_name').value, phone: document.getElementById('p_phone').value, email: document.getElementById('p_email').value, city: document.getElementById('p_city').value, ageGroup: document.getElementById('p_age').value, course: document.getElementById('p_course').value, studyMode: document.getElementById('p_study').value, note: "Nguồn: Form Đăng Ký Qua Popup" }; submitRegistration(data); this.reset(); });
document.getElementById('form_footer').addEventListener('submit', function(e) { e.preventDefault(); const data = { parentName: document.getElementById('f_name').value, phone: document.getElementById('f_phone').value, email: document.getElementById('f_email').value, city: document.getElementById('f_city').value, studyMode: document.getElementById('f_study').value, course: document.getElementById('f_course').value, ageGroup: document.getElementById('f_age').value, note: "Nguồn: Form Đăng Ký Cuối Trang" }; submitRegistration(data); this.reset(); });
