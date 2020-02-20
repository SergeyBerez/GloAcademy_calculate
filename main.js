const DAY_STRING = ['день', 'дня', 'дней'];
const startButton = document.querySelector('.start-button'),
  firstScreen = document.querySelector('.first-screen'),
  mainForm = document.querySelector('.main-form'),
  total = document.querySelector('.total'),
  formCalculate = document.querySelector('.form-calculate'),
  endButton = document.querySelector('.end-button'),
  fastRange = document.querySelector('.fast-range'),
  wantFaster = document.querySelector('.want-faster'),
  totalPriceSum = document.querySelector('.total_price__sum'),
  adapt = document.getElementById('adapt'),
  mobileTemplates = document.getElementById('mobileTemplates'),
  typeSite = document.querySelector('.type-site'),
  maxDeadLine = document.querySelector('.max-deadline'),
  rangeDeadline = document.querySelector('.range-deadline'),
  deadlineValue = document.querySelector('.deadline-value'),
  checkBoxLabel = document.querySelectorAll('.checkbox-label');

const DATA = {
  whichSite: ['landing', 'multiPage', 'onlineStore'],
  price: [4000, 8000, 26000],
  desktopTemplates: [50, 40, 30],
  adapt: 20,
  mobileTemplates: 15,
  editable: 10,
  metrikaYandex: [500, 1000, 2000],
  analyticsGoogle: [850, 1350, 3000],
  sendOrder: 500,
  deadlineDay: [
    [2, 7],
    [3, 10],
    [7, 14],
  ],
  deadlinePercent: [20, 17, 15],
};
function declOfNum(n, titles) {
  return (
    n +
    ' ' +
    titles[
      n % 10 === 1 && n % 100 !== 11
        ? 0
        : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
        ? 1
        : 2
    ]
  );
}

function showElem(elem) {
  elem.style.display = 'block';
}

function hideElem(elem) {
  elem.style.display = 'none';
}

function renderTextContent(total, site, maxDay, minDay) {
  typeSite.textContent = site;
  totalPriceSum.textContent = total;
  maxDeadLine.textContent = declOfNum(maxDay, DAY_STRING);
  rangeDeadline.min = minDay;
  rangeDeadline.max = maxDay;
  deadlineValue.textContent = declOfNum(rangeDeadline.value, DAY_STRING);
}
//=======эту функцию вывываем из функции hanlerCallBackForm   все пееключатели в дефолтное состояние и делаем подс чет
function priceCalculation(elem) {
  let result = 0;
  let index = 0;
  const option = [];
  let site = '';
  let maxDeadlineDay = DATA.deadlineDay[index][1];
  let minDeadlineDay = DATA.deadlineDay[index][0];

  for (let index = 0; index < checkBoxLabel.length - 1; index++) {
    checkBoxLabel[index].textContent = 'Нет';
  }
  if (elem.name === 'whichSite') {
    for (const item of formCalculate.elements) {
      if (item.type === 'checkbox') {
        item.checked = false;
      }
    }
    hideElem(fastRange);
  }
  //---------------
  for (const item of formCalculate.elements) {
    if (item.name === 'whichSite' && item.checked) {
      // console.log(item);
      site = item.dataset.site;
      // console.log(DATA.whichSite.indexOf('landing'));
      index = DATA.whichSite.indexOf(item.value);
      maxDeadlineDay = DATA.deadlineDay[index][1];
      minDeadlineDay = DATA.deadlineDay[index][0];
    } else if (item.classList.contains('calc-handler') && item.checked) {
      option.push(item.value);
      console.log(item.checked);
      if (document.querySelector(`.${item.value}_value`) != null) {
        item
          .closest('.switcher')
          .querySelector(`.${item.value}_value`).textContent = 'Да';
      }
    }
  }
  //-----------------
  option.forEach(key => {
    console.log(DATA[key]);
    if (typeof DATA[key] === 'number') {
      if (key === 'sendOrder') {
        result += DATA[key];
      } else {
        result += (DATA.price[index] * DATA[key]) / 100;
      }
    } else {
      if (key === 'desktopTemplates') {
        result += (DATA.price[index] * DATA[key][index]) / 100;
      } else {
        result += DATA[key][index];
      }
    }
  });
  //---------------
  result += DATA.price[index];
  renderTextContent(result, site, maxDeadlineDay, minDeadlineDay);
}
//========функця срабатывает на изменения нашей формы главной  скрывать и показывать range и вызывает расчет
function hanlerCallBackForm(event) {
  if (adapt.checked) {
    mobileTemplates.disabled = false;
  } else {
    mobileTemplates.disabled = true;
    mobileTemplates.checked = false;
  }
  const target = event.target;
  if (target.classList.contains('want-faster')) {
    target.checked ? showElem(fastRange) : hideElem(fastRange);
  }
  if (target.classList.contains('calc-handler')) {
    // console.log(target);
    priceCalculation(target);
  }
}
startButton.addEventListener('click', function() {
  showElem(mainForm);
  hideElem(firstScreen);
});

endButton.addEventListener('click', function() {
  for (const element of formCalculate.elements) {
    if (element.tagName === 'FIELDSET') {
      hideElem(element);
    }
    showElem(total);
  }
});
formCalculate.addEventListener('change', hanlerCallBackForm);
