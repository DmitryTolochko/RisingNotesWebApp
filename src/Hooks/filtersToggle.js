const filtersToggle = () =>{
    let filters = document.getElementById('filters-container-id')
    let btn = document.getElementById('f-toggle-btn')
    if(!filters) return
    filters.classList.toggle('filters-toggled')
    btn.classList.toggle('f-btn-active')
}

export default filtersToggle