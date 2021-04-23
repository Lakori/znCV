mobMenu();
function mobMenu() {
  let mobMenu = document.querySelector('.menuMob');
  let menuBurger = document.querySelector('.burger');

  //Mobile-menu

  menuBurger.addEventListener('click touchstart', e => {
    let mobMenu = menuBurger.nextElementSibling;
    menuBurger.classList.toggle('close')
    mobMenu.classList.toggle('open');
  })
  menuBurger.addEventListener('click', e => {
    let mobMenu = menuBurger.nextElementSibling;
    menuBurger.classList.toggle('close')
    mobMenu.classList.toggle('open');
  })

  mobMenu.addEventListener('click touchstart', e => {
    mobMenu.classList.remove('open');
    menuBurger.classList.remove('close')
  })
  mobMenu.addEventListener('click', e => {
    mobMenu.classList.remove('open');
    menuBurger.classList.remove('close')
  })
}

let url = `${window.location.origin}/api/1.0.0`;
let urlMain = `${window.location.origin}`;
const inputTelephone = document.querySelector('#telephone');
const sendSmsBtn = document.querySelector('#sendSmsBtn');
const inputSms = document.querySelector('#sms');
const checkSmsBtn = document.querySelector('#checkSms');
const inputFullName = document.querySelector('#fullName');
const inputEmail = document.querySelector('#email');
const inputRegion = document.querySelector('#region');
const inputCity = document.querySelector('#city');
const inputRegionLand = document.querySelector('#regionLand');
const radioApprovalDoc = document.getElementsByName('approvalDoc');
const radioConsentDoc = document.getElementsByName('consentDoc');
const textareaQuestion = document.querySelector('#textareaQuestion');
const inputAgree = document.querySelector('#agree');

const inputPayNow = document.querySelector('#payLater');
const payBtn = document.querySelector('#payBtn');

let message = document.querySelector('#message');
let user;
let products;
let tarifs;

inputTelephone.onfocus = function () {
  if (!inputTelephone.value) {
    inputTelephone.value = '+380'
  }
}



sendSmsBtn.addEventListener('click', sendSms);
checkSmsBtn.addEventListener('click', smsCode);
inputAgree.addEventListener('click', e => {
  inputAgree.checked ? payBtn.removeAttribute('disabled') : payBtn.setAttribute('disabled', 'disabled');
})

/**
 * send all data to bd and payment checkout
 */

payBtn.addEventListener('click', async e => {
  try {
    let data = createData();
    let formData = new FormData();
    formData.append('phone', inputTelephone.value);
    formData.append('fullName[surname]', data.surname);
    formData.append('fullName[name]', data.name);
    formData.append('fullName[patronymic]', data.patronymic);
    formData.append('email', inputEmail.value);
    formData.append('region', inputRegion.value);
    formData.append('city', inputCity.value);
    formData.append('receivedLandRegion', inputRegionLand.value);
    formData.append('isDocumentationApproved', data.approvalDoc);
    formData.append('isDocumentationDevelopmentApproved', data.consentDoc);
    formData.append('note', textareaQuestion.value)

    if (inputAgree.checked && !user) {
      if (inputPayNow.checked) {
        let account = await axios.post(`${url}/user-accounts`, formData);
        let user = account.data;
        let order = await createOrder(user);
        order.status === 201 ? await paymentCheckout(order.data.orderId) : null;
      } else {
        let account = await axios.post(`${url}/user-accounts`, formData);
        document.location.href = `${urlMain}/payment-later.html`;
      }
    } else if (inputAgree.checked && user) {
      if (inputPayNow.checked) {
        let account = await axios.put(`${url}/user-accounts/${user.userAccountId}`, formData);
        let order = await createOrder(user);
        order.status === 201 ? await paymentCheckout(order.data.orderId) : null;
      } else {
        let account = await axios.put(`${url}/user-accounts/${user.userAccountId}`, formData);
        document.location.href = `${urlMain}/payment-later.html`;
      }
    }
  } catch (err) {
    console.log(err)
  }
})

/**
 * send SMS
 */
async function sendSms() {
  try {
    let response = await axios.post(`${url}/secure-sessions`, { phone: inputTelephone.value });
    message.textContent = 'Вам було відправлено смс з кодом';
    message.classList.add('success');
    sms.removeAttribute('disabled');
    checkSmsBtn.removeAttribute('disabled');
  } catch (err) {
    message.textContent = 'Виникла помилка, спробуйте пізніше';
    message.classList.add('error')
  }
}

/**
 * send SMS code
 */
async function smsCode() {
  try {
    let response = await axios.put(`${url}/secure-sessions/${inputSms.value}`, { confirmed: true });

    await createTarifs();
    await removeDisable();


    if (response.status === 200) {
      message.textContent = 'Номер телефону підтверджен';
      message.classList.add('success');

      let conditions = encodeURIComponent(
        JSON.stringify({
          phone: inputTelephone.value
        })
      );
      let userResponse = await axios.get(`${url}/user-accounts?conditions=${conditions}`);
      user = userResponse.data.page.data[0]
      if (user) {
        addDataInInputs(user);
      } else {
        user = null;
      }


    }
  } catch (err) {
    console.log(err)
    message.textContent = 'Невірний код смс або телефон';
    message.classList.add('error')
    user = null;
  }
}

/**
 * Creating data
 */

function createData() {

  let approvalDoc;
  let consentDoc;
  let surname;
  let name;
  let patronymic;

  radioApprovalDoc.forEach(item => {
    if (item.checked) {
      approvalDoc = item.value
    }
  })
  radioConsentDoc.forEach(item => {
    if (item.checked) {
      consentDoc = item.value
    }
  })

  let fullNameArr = inputFullName.value.split(' ');
  surname = fullNameArr[0] ? fullNameArr[0] : ' ';
  name = fullNameArr[1] ? fullNameArr[1] : ' ';

  patronymic = fullNameArr[2] ? fullNameArr[2] : ' ';

  return {
    approvalDoc: approvalDoc,
    consentDoc: consentDoc,
    surname: surname,
    name: name,
    patronymic: patronymic
  };
}

/**
 * Adding Data in inputs
 * @param {object} user 
 */
function addDataInInputs(user) {
  inputFullName.value = concatFullname(user.fullName);
  inputEmail.value = user.email || '';
  inputRegion.value = user.region || '';
  inputCity.value = user.city || '';
  inputRegionLand.value = user.receivedLandRegion || '';
  textareaQuestion.value = user.note || '';

  radioConsentDoc.forEach(item => {
    if (item.value == `${user.isDocumentationDevelopmentApproved}`) {
      item.checked = true;
    }
  })
  radioApprovalDoc.forEach(item => {
    if (item.value == `${user.isDocumentationApproved}`) {
      item.checked = true;
    }
  })


}

/**
 * 
 * @param {object} fullNameObj 
 * @param {string} fullNameObj.surname
 * @param {string} fullNameObj.name
 * @param {string} fullNameObj.patronymic
 */
function concatFullname(fullNameObj) {
  const name = fullNameObj.name || '';
  const surname = fullNameObj.surname || '';
  const patronymic = fullNameObj.patronymic || '';
  const fullname = `${surname} ${name} ${patronymic}`;
  return fullname.trim();
}


/**
 * Getting all tarifs (products)
 */
async function getProducts() {
  try {
    let products = await axios.get(`${url}/products`);
    return products.data.page.data
  } catch (err) {
    console.log(err)
  }
}


/**
 * Get Products and generate Cards for them, adding event Listener on cards
 */
async function createTarifs() {
  if (isProductsCardAlreadyCreated()) {
    return;
  }

  products = await getProducts();

  createProductsTitle()

  products = products.sort((product1, product2) => {
    return product2.price - product1.price;
  });
  products.forEach((item, index) => {
    createProductCard(item, index)
  })
  tarifs = document.getElementsByClassName('card');
  for (let i = 0; i < tarifs.length; i++) {
    tarifs[i].addEventListener('click', e => {
      for (let y = 0; y < tarifs.length; y++) {
        tarifs[y].classList.remove('selected')
      }
      e.currentTarget.classList.add('selected')


    })
  }
}

function isProductsCardAlreadyCreated() {
  let productCardContainer = document.getElementsByClassName('format__cards');
  return !!productCardContainer.length;
}

/**
 * Create product cards container Title
 */
function createProductsTitle() {
  let format = document.querySelector('.format');

  let formatCards = document.createElement('div');
  formatCards.classList.add('format__cards');

  let title = document.createElement('div');

  title.classList.add('title');
  title.textContent = 'Оберіть ваш формат співпраці'

  let subtitle = document.createElement('div');

  subtitle.classList.add('subtitle');
  subtitle.innerHTML = `Для початку роботи оберіть план підписки на рік.
    <br/> Ви маєте змогу сплатити внесок одразу або після обробки Вашої анкети.`
  format.append(title);
  format.append(subtitle);
  format.append(formatCards)

}

/**
 * Create product cards
 * @param {object} item - current product
 * @param {number} index -current index
 */
function createProductCard(item, index) {
  let card = document.createElement('div');
  let productCardContainer = document.getElementsByClassName('format__cards');
  card.classList.add('card');
  if (index === 0) {
    card.classList.add('selected');
  }

  card.setAttribute('id', item._id);
  let title = document.createElement('div');
  title.classList.add('title');
  title.textContent = item.description;

  let cost = document.createElement('div');
  cost.classList.add('cost');
  cost.innerHTML = `<b> ${item.price / 100}</b> грн/рік`;

  let a = document.createElement('a');
  a.classList.add('more');
  a.textContent = 'Докладніше...';
  a.href = "/tarifs.html"

  productCardContainer[0].append(card)
  card.append(title)
  card.append(cost)
  card.append(a)

}


/**
 * Create order
 * @param {object} user  current user
 */
async function createOrder(user) {
  try {
    let product;
    let tarif;
    for (let i = 0; i < tarifs.length; i++) {
      if (tarifs[i].classList.length === 2) {
        tarif = tarifs[i]
      }
    }

    for (let i = 0; i < products.length; i++) {
      if (products[i]._id == tarif.id) {
        product = products[i];
      }
    }
    let formData = new FormData();
    formData.append('userAccountId', user.userAccountId);
    formData.append('productId', product._id);
    formData.append('amount', product.price);
    formData.append('description', product.description);
    formData.append('currency', product.currency)
    let response = await axios.post(`${url}/orders`, formData);
    return response;
  } catch (err) {
    console.log(err)
  }
}



/**
 * Payment Checkout
 * @param {String} orderId 
 */
async function paymentCheckout(orderId) {
  try {
    let payment = await axios.get(`${url}/payments/checkout?paymentPlatform=AlfaBank&orderId=${orderId}`);
    console.log(payment)
    if (payment.data.checkoutUrl) {
      document.location.href = payment.data.checkoutUrl;
    } else {
      console.log(' нету урл')
    }
  } catch (err) {
    console.log(err)
  }
}

//remove disabled

function removeDisable() {
  inputFullName.removeAttribute('disabled');
  inputCity.removeAttribute('disabled');
  inputEmail.removeAttribute('disabled');
  inputRegion.removeAttribute('disabled');
  inputRegionLand.removeAttribute('disabled');
  textareaQuestion.removeAttribute('disabled');
  inputAgree.removeAttribute('disabled')
  payBtn.removeAttribute('disabled');
}

