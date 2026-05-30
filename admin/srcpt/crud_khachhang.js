import { db } from './config.js';
import { ref, update, remove, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

window.allRecs = []; window.globalData = {}; 

window.loadData = function() { 
    onValue(ref(db, 'registrations'), (snap) => { 
        window.allRecs = []; window.globalData = {}; 
        if (snap.exists()) { snap.forEach((c) => { let i = c.val(); i.id = c.key; window.allRecs.push(i); window.globalData[i.id] = i; }); window.allRecs.reverse(); } 
        window.applyFilters(); 
    }); 
};

window.applyFilters = function() { 
    const age = document.getElementById('filterAge') ? document.getElementById('filterAge').value : 'all'; 
    const d = document.getElementById('filterDate') ? document.getElementById('filterDate').value : ''; 
    let fd = window.allRecs.filter(i => { 
        let mAge = (age==='all'||i.ageGroup===age); let mDate = true; 
        if(d&&i.timestamp){ const dObj = new Date(i.timestamp); const str = `${dObj.getFullYear()}-${String(dObj.getMonth()+1).padStart(2,'0')}-${String(dObj.getDate()).padStart(2,'0')}`; mDate = (str===d); } 
        return mAge&&mDate; 
    }); 
    if(document.getElementById('totalCount')) document.getElementById('totalCount').innerText = `Tổng: ${fd.length}`; 
    window.draw(fd); 
};

window.draw = function(arr) { 
    const tbody = document.getElementById('data-body'); if(!tbody) return; tbody.innerHTML=''; 
    if(arr.length===0){ tbody.innerHTML='<tr><td colspan="9" class="text-center py-4">Trống.</td></tr>'; return; } 
    arr.forEach((i, idx) => { 
        tbody.innerHTML+=`<tr>
            <td class="text-center"><input type="checkbox" class="row-checkbox" value="${i.id}"></td><td>${idx+1}</td>
            <td><strong class="text-primary">${i.parentName||''}</strong></td>
            <td><div class="mb-1"><i class="bi bi-telephone-fill text-danger"></i> ${i.phone||''}</div><div><i class="bi bi-envelope-fill text-secondary"></i> <span class="small">${i.email||'<i class="text-muted">Không có</i>'}</span></div></td>
            <td>${i.city||'<span class="text-muted small">Chưa chọn</span>'}</td>
            <td><div class="mb-1"><span class="badge bg-primary w-100 text-start text-wrap"><i class="bi bi-book"></i> ${i.course||'Chưa chọn khóa'}</span></div><div class="mb-1"><span class="badge bg-info text-dark w-100 text-start"><i class="bi bi-pc-display-horizontal"></i> ${i.studyMode||'Chưa chọn hình thức'}</span></div><div><span class="badge bg-secondary w-100 text-start"><i class="bi bi-person-badge"></i> Tuổi: ${i.ageGroup||'Chưa rõ'}</span></div></td>
            <td class="note-cell" style="max-width: 150px; white-space: pre-wrap; font-size: 13px;">${i.note||'<i class="text-muted">Trống</i>'}</td>
            <td class="small">${i.timestamp?new Date(i.timestamp).toLocaleString('vi-VN'):''}</td>
            <td class="text-center"><button class="btn btn-sm btn-primary mb-1 w-100" onclick="window.oEdit('${i.id}')"><i class="bi bi-pencil"></i></button> <button class="btn btn-sm btn-danger w-100" onclick="window.dRec('${i.id}')"><i class="bi bi-trash"></i></button></td>
        </tr>`; 
    }); 
};

window.toggleSelectAll = (el) => { document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = el.checked); };
window.bulkDelete = async () => {
    const checked = document.querySelectorAll('.row-checkbox:checked');
    if (checked.length === 0) return Swal.fire({ icon: 'warning', title: 'Chưa chọn dữ liệu', text: 'Vui lòng tích vào các ô để xóa!' });
    Swal.fire({ title: `Xóa ${checked.length} dòng đã chọn?`, text: "Không thể hoàn tác!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Xóa vĩnh viễn' }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({title: 'Đang xóa...', allowOutsideClick: false, didOpen: () => {Swal.showLoading()}});
            const updates = {}; checked.forEach(cb => { updates[`registrations/${cb.value}`] = null; });
            await update(ref(db), updates); document.getElementById('selectAllCheckbox').checked = false; Swal.fire('Đã xóa', '', 'success');
        }
    });
};

window.oEdit = (id) => { 
    const d=window.globalData[id]; 
    document.getElementById('edit_id').value=id; document.getElementById('edit_name').value=d.parentName||''; document.getElementById('edit_phone').value=d.phone||''; document.getElementById('edit_email').value=d.email||''; document.getElementById('edit_city').value=d.city||''; document.getElementById('edit_age').value=d.ageGroup||''; document.getElementById('edit_study').value=d.studyMode||''; document.getElementById('edit_course').value=d.course||''; document.getElementById('edit_note').value=d.note||''; 
    if(window.eMod) window.eMod.show(); 
}; 

window.dRec = async (id) => { Swal.fire({title:'Xóa vĩnh viễn?', icon:'warning', showCancelButton:true}).then(async (r)=>{ if(r.isConfirmed){ await remove(ref(db, `registrations/${id}`)); Swal.fire('Đã xóa', '', 'success'); } }); }; 

document.addEventListener("DOMContentLoaded", () => {
    let m = document.getElementById('editModal'); if(m) window.eMod = new bootstrap.Modal(m); 
    let btnSave = document.getElementById('btnSaveEdit');
    if(btnSave) btnSave.addEventListener('click', async () => { const id=document.getElementById('edit_id').value; await update(ref(db, `registrations/${id}`),{ parentName:document.getElementById('edit_name').value, phone:document.getElementById('edit_phone').value, email:document.getElementById('edit_email').value, city:document.getElementById('edit_city').value, ageGroup:document.getElementById('edit_age').value, studyMode:document.getElementById('edit_study').value, course:document.getElementById('edit_course').value, note:document.getElementById('edit_note').value }); if(window.eMod) window.eMod.hide(); Swal.fire({toast:true, position:'top-end', icon:'success', title:'Đã lưu!', showConfirmButton:false, timer:2000}); });
    let fBtn = document.getElementById('btnFilter'); if(fBtn) fBtn.addEventListener('click', window.applyFilters); 
    let cBtn = document.getElementById('btnClearFilter'); if(cBtn) cBtn.addEventListener('click', ()=>{ document.getElementById('filterAge').value='all'; document.getElementById('filterDate').value=''; window.applyFilters(); });
});