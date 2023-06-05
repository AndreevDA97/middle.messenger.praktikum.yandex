window.onclick = function(event) {
    // когда пользователь нажимает на внешнюю область модального окна
    if (event.target.classList.contains('modal_closable')) {
        for (let el of document.getElementsByClassName('modal_closable')) {
            // удалить класс отображения и сбросить якорь модального окна
            el.classList.remove('modal_show');
            location.hash = '#';
        }
    }
    // когда пользователь нажимает на внешние элементы меню
    if (!event.target.matches('.dropdown__btn')
        && !event.target.parentElement.matches('.dropdown__btn')) {
        let dropdowns = document.getElementsByClassName('dropdown__menu');
        for (let dropdown of dropdowns)
        {
            dropdown.classList.remove('dropdown__menu_show');
            let button = dropdown.parentElement.querySelector('.dropdown__btn');
            button.classList.remove('dropdown__btn_active');
        }
    }
};
document.addEventListener("DOMContentLoaded", () => {
    // открывать выпадающее меню по нажатию кнопки
    let dropdownButtons = document.querySelectorAll( '.dropdown__btn' );
    dropdownButtons.forEach((button) => {
        button.addEventListener('click', function (e) {
            this.classList.toggle('dropdown__btn_active');
            let dropdownMenu = this.parentElement.querySelector('.dropdown__menu');
            dropdownMenu.classList.toggle('dropdown__menu_show');
        });
    });
    // выводить имя загружаемого файла в форме ввода
    let inputs = document.querySelectorAll( '.input-file input[type=file]' );
    inputs.forEach((input) => {
        // указать значение имени и добавить класс-модификатор selected
        input.addEventListener( 'change', function (e) {
            let fileName = this.files[0].name;
            this.parentElement.querySelector('span').innerHTML = fileName;
            this.parentElement.classList.add('input-file_selected');
        });
    });
});
