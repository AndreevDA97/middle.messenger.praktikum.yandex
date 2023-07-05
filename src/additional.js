// подключение вспомогательных скриптов макета (меню, модальное окно, отображение)
window.additionalEffects = (function () {
  const dropdownButtonsClickFunc = function (e) {
    if (e.target.parentElement !== this && e.target !== this) return;
    // активировать кнопку и отобразить выпадающее меню
    this.classList.toggle('dropdown__btn_active');
    const dropdownMenu = this.parentElement.querySelector('.dropdown__menu');
    dropdownMenu.classList.toggle('dropdown__menu_show');
  };
  const inputsChangeFunc = function (e) {
    if (e.target.parentElement !== this && e.target !== this) return;
    // указать значение имени и добавить класс-модификатор selected
    const fileName = this.files[0].name;
    this.parentElement.querySelector('span').innerHTML = fileName;
    this.parentElement.classList.add('input-file_selected');
  };
  function setListeners(removeFlag = false, onModalHide = () => {}) {
    // открывать выпадающее меню по нажатию кнопки
    const dropdownButtons = document.querySelectorAll('.dropdown__btn');
    dropdownButtons.forEach((button) => {
      button.onclick = dropdownButtonsClickFunc.bind(button);
      //button.addEventListener('click', dropdownButtonsClickFunc.bind(button));
      if (removeFlag) button.onclick = null;
    });
    // выводить имя загружаемого файла в форме ввода
    const inputs = document.querySelectorAll('.input-file input[type=file]');
    inputs.forEach((input) => {
      input.onchange = inputsChangeFunc.bind(input);
      //input.addEventListener('change', inputsChangeFunc.bind(input));
      if (removeFlag) input.onchange = null;
    });
    // глобальный обработчик нажатий в окне
    window.onclick = function (event) {
      // когда пользователь нажимает на внешнюю область модального окна
      if (event.target.classList.contains('modal_closable')) {
        for (const el of document.getElementsByClassName('modal_closable')) {
          // удалить класс отображения и сбросить якорь модального окна
          el.classList.remove('modal_show');
          location.hash = '#';
          // вызвать событие закрытия модального окна
          if (typeof onModalHide === 'function')
            onModalHide();
        }
      }
      // когда пользователь нажимает на внешние элементы меню
      if (!event.target.matches('.dropdown__btn')
          && !event.target.parentElement.matches('.dropdown__btn')) {
        const dropdowns = document.getElementsByClassName('dropdown__menu');
        for (const dropdown of dropdowns) {
          dropdown.classList.remove('dropdown__menu_show');
          const button = dropdown.parentElement.querySelector('.dropdown__btn');
          button.classList.remove('dropdown__btn_active');
        }
      }
    };
  }
  return {
    create: (onModalHide) => { setListeners(false, onModalHide); },
    clear: () => { setListeners(true); },
  };
}());
