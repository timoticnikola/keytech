window.onload = () => {
  // ! FIX NAVLINKS LOCAL - AFTER DELETE LOCALSTORAGE - NOT WORKING
  const navLinksArray = fetchLocalStorage("navLinks");
  const productsArray = fetchLocalStorage("products");
  const socialLinksArray = fetchLocalStorage("socialLinks");
  const categoriesArray = fetchLocalStorage("categories");
  const brandsArray = fetchLocalStorage("brands");

  async function jsonRequest(fileName) {
    try {
      let res = await fetch(`./assets/data/${fileName}.json`);
      return res.json();
    } catch (error) {
      console.error(error);
    }
  }

  function fetchLocalStorage(fileName) {
    jsonRequest(fileName).then(instance => {
      localStorage.setItem(`${fileName}Local`, JSON.stringify(instance));
    });
    return JSON.parse(localStorage.getItem(`${fileName}Local`));
  }


  // Run functions
  createNavBar(navLinksArray);
  createFooter(navLinksArray);

  function createNavBar(data) {
    navLinks("nav-warpper", data);
    navLinkShop("nav");
  }

  function navLinkShop(ulID) {
    let ulTag = document.getElementById(`${ulID}`);
    let liTag = document.createElement("li");
    let iTag = document.createElement("i");
    iTag.setAttribute("class", "fa-solid fa-basket-shopping");
    iTag.setAttribute("id", "shopping-card");
    liTag.appendChild(iTag);
    let pTag = document.createElement("span");
    pTag.setAttribute("id", "incard-product-number");
    liTag.appendChild(pTag);
    ulTag.appendChild(liTag);
    inCardCount();
  }

  function navLinks(id, navLinksLocal) {
    let container = document.getElementById(`${id}`);
    let ulTag = document.createElement("ul");
    ulTag.setAttribute("id", "nav");
    for (let link of navLinksLocal) {
      let liTag = document.createElement("li");
      let aTag = document.createElement("a");
      let aTagContent = document.createTextNode(`${link.name}`);
      aTag.append(aTagContent);
      aTag.setAttribute("href", `${link.link}`);
      liTag.appendChild(aTag);
      ulTag.appendChild(liTag);
    }
    container.appendChild(ulTag);
  }
  // let productsLocal = jsonParse("productsLocal");
  // showProducts(productsArray);

  function brandsFilter(productsArray) {
    let selectedBrands = [];
    let brandsElements = document.querySelectorAll(".brands-filter-item:checked");
    for (let element of brandsElements) {
      selectedBrands.push(parseInt(element.value));
    }
    if (selectedBrands.length != 0) {
      return productsArray.filter(function (el) {
        for (let item of selectedBrands) {
          // console.log(item);
          if (el.brandID == item) {
            return el;
          }
        }
      });
    }
    return productsArray;
  }

  function categoryFilter(productsArray) {
    let selectedCategory = [];
    let categoryElements = document.querySelectorAll(".category-filter-item:checked");
    for (let element of categoryElements) {
      selectedCategory.push(parseInt(element.value));
    }
    if (selectedCategory.length != 0) {
      return productsArray.filter(function (el) {
        for (let item of selectedCategory) {
          if (el.brandID == item) {
            return el;
          }
        }
      });
    }
    return productsArray;
  }

  function showProducts(productsArray) {
    productsArray = brandsFilter(productsArray);
    productsArray = categoryFilter(productsArray);
    productsArray = reviewsFilter(productsArray);
    let html = "";
    let container = document.getElementById("products");
    if (productsArray.length != 0) {
      for (let product of productsArray) {
        html += `<div class="product">
              <img src="${product.image.src}" alt="${product.image.alt}" />
              <p class="product-category-name">${categoryName(product.categoryID)}</p>
              <p class="product-brandname">${showBrand(product.brandID)}</p>
              <p class="product-name">${product.name}</p>
              <p class="product-description">${product.descript}</p>
              <p class="product-reviews">Reviews: ${product.score}<i class="fa-solid fa-star"></i></p>
              <div class="product-price">
                <p>Price:</p>
                <s class="product-price-old">${product.price.discount != 0 ? product.price.old + "$" : ""}</s>
                <p class="product-price-new">${priceCalculator(product.price.old, product.price.discount)}$</p>
              </div>
              <input class="product-add-to-card-btn" type="button" data-id="${product.id}" value="Add to card" />
            </div>`;
      }
    } else {
      html += `<div id="product-message">
                <h2>There is no products with selected criteria!</h2>
              </div>`;
      console.log(1);
    }
    container.innerHTML = html;
    inCardProductsShow();
    let scoreP = document.getElementById("reviews-range-place");
    if (scoreP != null) {
      let rangeSlider = document.getElementById("reviews-range-sllider");
      scoreP.innerHTML = rangeSlider.value / 10;
    }
    eventListener("product-add-to-card-btn", "class", "click", addToCard);
  }
  function categoryName(productCategoryID) {
    let categoryName = categoriesArray.filter(function (el) {
      return el.id == productCategoryID;
    });
    return categoryName[0].name;
  }
  function priceCalculator(productPrice, productDiscount) {
    let price = productPrice * ((100 - productDiscount) / 100);
    return price.toFixed(2);
  }
  function showBrand(brandID) {
    let html = "";
    for (let brand of brandsArray) {
      if (brand.id == brandID) {
        html += `${brand.name}`;
      }
    }
    return html;
  }


  function filterProducts() {
    showProducts(productsArray);
  }
  // Make side filters
  function showProductsFilter(filterName, containerName, arrayName, className) {
    let html = "";
    html += `<p>${filterName}</p>
            <ul>`;
    let container = document.getElementById(containerName);
    for (let item of arrayName) {
      html += `<li>
                  <input type="checkbox" name="${item.name}" class="${className}" value="${item.id}" id="${item.name}">
                  <label for="${item.name}">${item.name} </label>
                </li>`;
    }
    html += `</ul>`;
    container.innerHTML = html;
    eventListener(className, "class", "change", filterProducts);
  }

  // Show Reviews side filter

  function showReviews() {
    let container = document.getElementById("reviews-filter");
    let html = `<p>Reviews</p>
        <div class="slidecontainer">
          <input type="range" min="10" max="50" value="1" class="slider reviews-filter-item" id="reviews-range-sllider" />
          <p id="reviews-range-place"></p>
        </div>`;
    container.innerHTML = html;
    let score = document.getElementById("reviews-range-sllider");
    let scoreP = document.getElementById("reviews-range-place");
    scoreP.innerHTML = "1";
    score.addEventListener("click", filterProducts)
  }
  // Filter products per reviews
  function reviewsFilter(productsArray) {
    let scoreContainer = document.getElementById("reviews-range-sllider");
    let score;
    if (scoreContainer == null) {
      score = 1;
    }
    else {
      score = scoreContainer.value / 10;
    }
    return productsArray.filter(function (el) {
      if (el.score >= score) {
        return el;
      }
    });
  }

  function createFooter(data) {
    let footerId = document.getElementById("footer");
    let footerWrapper = document.createElement("div");
    footerWrapper.setAttribute("class", "wrapper");
    let footerTop = document.createElement("div");
    let footerNavLinks = document.createElement("div");
    footerNavLinks.setAttribute("id", "footer-navlinks");
    let footerNavLinksP = document.createElement("p");
    let footerNavLinksPContent = document.createTextNode("Navigation");
    footerNavLinksP.appendChild(footerNavLinksPContent);
    footerNavLinks.appendChild(footerNavLinksP);
    footerTop.appendChild(footerNavLinks);
    footerTop.setAttribute("id", "footer-top");
    let footerBottom = document.createElement("div");
    let footerCopyright = document.createElement("p");
    let footerCopyrightContent = document.createTextNode("© Copyright 2022");
    footerCopyright.appendChild(footerCopyrightContent);
    footerBottom.appendChild(footerCopyright);
    footerBottom.setAttribute("id", "footer-top");
    footerWrapper.appendChild(footerTop);
    footerWrapper.appendChild(footerBottom);
    footerId.appendChild(footerWrapper);
    navLinks("footer-navlinks", data);
  }
  function eventListener(name, tagType, eventMethod, functionName) {
    if (tagType == "id") {
      let item = document.querySelector(`#${name}`);
      item.addEventListener(`${eventMethod}`, functionName);
    } else {
      let items = document.querySelectorAll(`.${name}`);
      for (let item of items) {
        item.addEventListener(`${eventMethod}`, functionName);
      }
    }
    // ! Dodaj proveru da li je niz ili ne..
  }

  function addToCard() {
    let dataID = this.getAttribute("data-id");
    if (localStorage.getItem("addToCardList")) {
      let addToCardList = jsonParse("addToCardList");
      if (addToCardList.filter((e) => e.id == dataID).length) {
        cardMessages("Product already in card!");
      } else {
        addToCardList.push({
          id: dataID,
          quantity: 1,
        });
        cardMessages("Product added to card!");
        localStorage.setItem("addToCardList", JSON.stringify(addToCardList));
      }
    } else {
      let jsonTe = [];
      jsonTe[0] = {
        id: dataID,
        quantity: 1,
      };
      localStorage.setItem("addToCardList", JSON.stringify(jsonTe));
    }
    inCardCount();
    inCardProductsShow();
    classGe();
  }



  // Test shopping-card-container
  eventListener("shopping-card", "id", "click", openCard);
  function openCard() {
    let shoppingCardContainer = document.querySelector(".shopping-card-container");
    shoppingCardContainer.classList.add("shopping-card-active");
  }
  eventListener("card-close", "id", "click", closeCard);
  function closeCard() {
    let shoppingCardContainer = document.querySelector(".shopping-card-container");
    shoppingCardContainer.classList.remove("shopping-card-active");
  }


  // Add to card
  const addToCardBtnsList = document.querySelectorAll(".product-add-to-card-btn");
  for (let addToCardBtn of addToCardBtnsList) {
    addToCardBtn.addEventListener("click", function () {
      let dataID = this.getAttribute("data-id");
      if (localStorage.getItem("addToCardList")) {
        let addToCardList = jsonParse("addToCardList");
        if (addToCardList.filter((e) => e.id == dataID).length) {
          cardMessages("Product already in card!");
        } else {
          addToCardList.push({
            id: dataID,
            quantity: 1,
          });
          cardMessages("Product added to card!");
          localStorage.setItem("addToCardList", JSON.stringify(addToCardList));
        }
      } else {
        let jsonTe = [];
        jsonTe[0] = {
          id: dataID,
          quantity: 1,
        };
        localStorage.setItem("addToCardList", JSON.stringify(jsonTe));
      }
      inCardCount();
      inCardProductsShow();
    });
  }

  // Add to card message
  function cardMessages(text) {
    let messageDivTest = document.querySelector(".message");
    if (messageDivTest) {
      messageDivTest.parentNode.removeChild(messageDivTest);
    }
    let messageDiv = document.createElement("div");
    messageDiv.setAttribute("class", "message");
    let pTag = document.createElement("p");
    let pTagContent = document.createTextNode(`${text}`);
    pTag.appendChild(pTagContent)
    messageDiv.appendChild(pTag);
    let bodyTag = document.getElementsByTagName("body");
    bodyTag[0].appendChild(messageDiv);
    var clearElement = setInterval(() => {
      if (messageDiv.parentElement == null) {
        clearInterval(clearElement);
      } else {
        messageDiv.parentElement.removeChild(messageDiv);
      }
    }, 5000);
  }

  // In card counter
  function inCardCount() {
    let pTag = document.getElementById("incard-product-number");
    if (localStorage.getItem("addToCardList")) {
      let cardCounts = jsonParse("addToCardList").length;
      pTag.innerHTML = ` (${cardCounts})`;
    }
    else {
      pTag.innerHTML = " (0)";
    }
  }
  // InCardProducts
  function inCardProductsShow() {
    let addToCardList = jsonParse("addToCardList");
    let container = document.getElementById("card-products");
    container.innerHTML = "";
    if (addToCardList != null) {
      for (let item of addToCardList) {
        let cardProdict = document.createElement("div");
        cardProdict.setAttribute("class", "card-product");
        let imgContainer = document.createElement("img");
        imgContainer.setAttribute("src", `${showInCardProductData(item.id, "image", "src")}`);
        imgContainer.setAttribute("alt", `${showInCardProductData(item.id, "image", "alt")}`);
        cardProdict.appendChild(imgContainer);
        let cardProduictsRight = document.createElement("div");
        cardProduictsRight.setAttribute("class", "card-product-right");
        cardProdict.appendChild(cardProduictsRight);
        let pProductName = document.createElement("p");
        let pProductNameContent = document.createTextNode(`${showInCardProductData(item.id, "name")}`);
        pProductName.appendChild(pProductNameContent);
        cardProduictsRight.appendChild(pProductName);
        let pBrandName = document.createElement("p");
        let pPBrandNameContent = document.createTextNode(`${showInCardProductData(item.id, "brandID")}`);
        pBrandName.appendChild(pPBrandNameContent);
        cardProduictsRight.appendChild(pBrandName);
        let pProductPrice = document.createElement("p");
        let pProductPriceContent = document.createTextNode(`${showInCardProductData(item.id, "price", "new")}`);
        pProductPrice.appendChild(pProductPriceContent);
        cardProduictsRight.appendChild(pProductPrice);
        let cardProductTools = document.createElement("div");
        cardProductTools.setAttribute("class", "card-product-tools");
        cardProduictsRight.appendChild(cardProductTools);
        let cardProductQuantity = document.createElement("div");
        cardProductQuantity.setAttribute("class", "card-product-quantity");
        let inputValueMinus = document.createElement("input");
        inputValueMinus.setAttribute("type", "button");
        inputValueMinus.setAttribute("class", "quantityRegul");
        inputValueMinus.setAttribute("data-id", `${item.id}`);
        inputValueMinus.setAttribute("value", "-");
        cardProductQuantity.appendChild(inputValueMinus);
        let itemQuantity = document.createElement("p");
        let itemQuantityContent = document.createTextNode(`${item.quantity}`);
        itemQuantity.appendChild(itemQuantityContent);
        cardProductQuantity.appendChild(itemQuantity);
        let inputValuePlus = document.createElement("input");
        inputValuePlus.setAttribute("type", "button");
        inputValuePlus.setAttribute("class", "quantityRegul");
        inputValuePlus.setAttribute("data-id", `${item.id}`);
        inputValuePlus.setAttribute("value", "+");
        cardProductQuantity.appendChild(inputValuePlus);
        cardProductTools.appendChild(cardProductQuantity)
        let iBin = document.createElement("i");
        iBin.setAttribute("class", "fa fa-trash");
        iBin.setAttribute("data-id", `${item.id}`);
        iBin.setAttribute("aria-hidden", "true");
        cardProductTools.appendChild(iBin);
        container.appendChild(cardProdict);
      }
    }
    else {
      // cardMessages("Deleted all products from card");
      let pTag = document.createElement("p");
      let pTagContent = document.createTextNode("Card is empty.");
      pTag.appendChild(pTagContent);
      pTag.setAttribute("id", "empty-card");
      container.appendChild(pTag);
    }
    deleteProducts();
    inCardCount();
    classGe();
  }

  function totalPrice() {
    let addToCardList = jsonParse("addToCardList")
    let totalPrice = 0;
    let priceContainer = document.getElementById("card-total-price");
    if (addToCardList != null && addToCardList != "undefined") {
      let quantityPrice = addToCardList.map(function (el) {
        for (let item of productsArray) {
          if (item.id == el.id) {
            return el.quantity * priceCalculator(item.price.old, item.price.discount);
          }
        }
      });
      for (let item of quantityPrice) {
        totalPrice += item;
      }
      priceContainer.innerHTML = `Total: ${totalPrice.toFixed(2)}$`;
    } else {
      priceContainer.innerHTML = `Total: ${totalPrice.toFixed(2)}$`;
    }
  }
  function calculateItemPrice(itemID, price = null) {
    let addToCardList = jsonParse("addToCardList");
    let filtered = addToCardList.filter(function (el) {
      return el.id == itemID;
    });
    if (price == null) {
      let filteredPrice = productsArray.filter(function (el) {
        return el.id == itemID;
      });
      price = priceCalculator(filteredPrice[0].price.old, filteredPrice[0].price.discount);
    }
    let totalPrice = filtered[0].quantity * price;
    return `${price}$ x ${filtered[0].quantity} = ${totalPrice.toFixed(2)}$`;
  }

  function showInCardProductData(itemID, objectName, objectName2 = null) {
    let productsArray = jsonParse("productsLocal");
    let productName = productsArray.filter(function (el) {
      return el.id == itemID;
    });
    if (objectName == "brandID") {
      for (let item of brandsArray) {
        if (productName[0].brandID == item.id) {
          return item.name;
        }
      }
    }
    if (objectName == "price") {
      return calculateItemPrice(productName[0].id, productName[0][objectName][objectName2]);
    }
    if (objectName2 != null) {
      return productName[0][objectName][objectName2];
    } else {
      return productName[0][objectName];
    }
  }
  function classGe() {
    let quantityRegulList = document.querySelectorAll(".quantityRegul");
    for (let item of quantityRegulList) {
      item.addEventListener("click", function () {
        let dataQuantity = jsonParse("addToCardList");
        if (this.value == "+") {
          for (let data of dataQuantity) {
            if (data.id == this.getAttribute("data-id")) {
              data.quantity += 1;
              localStorage.setItem("addToCardList", JSON.stringify(dataQuantity));
              this.parentElement.getElementsByTagName("p")[0].innerHTML = data.quantity;
            }
          }
        } else {
          for (let data of dataQuantity) {
            if (data.id == this.getAttribute("data-id")) {
              if (data.quantity > 1) {
                data.quantity -= 1;
                localStorage.setItem("addToCardList", JSON.stringify(dataQuantity));
                this.parentElement.getElementsByTagName("p")[0].innerHTML = data.quantity;
              }
            }
          }
        }
        totalPrice();
        calculateItemPrice(item.getAttribute("data-id"));
        inCardProductsShow();
      });
    }
  }

  function deleteProducts() {
    let binItems = document.querySelectorAll(".fa-trash");
    for (let item of binItems) {
      item.addEventListener("click", () => {
        let addToCardList = jsonParse("addToCardList");
        for (let data of addToCardList) {
          if (data.id == item.getAttribute("data-id")) {
            let filteredList = addToCardList.filter(function (el) {
              return el.id !== `${data.id}`;
            });
            localStorage.setItem("addToCardList", JSON.stringify(filteredList));
          }
        }
        if (jsonParse("addToCardList").length == 0) {
          localStorage.removeItem("addToCardList");
        }
        inCardProductsShow();
        cardMessages("Product deleted from card!");
      });
    }
    totalPrice();
  }
  function deleteAllProducts() {
    localStorage.removeItem("addToCardList");
    cardMessages("Deleted all products from card");
    inCardProductsShow();
    totalPrice();
  }

  eventListener("delete-all-products", "id", "click", deleteAllProducts);

  function jsonParse(data) {
    let jsonData = JSON.parse(localStorage.getItem(`${data}`));
    return jsonData;
  }
  function resetFilters() {
    let brandsFilters = document.querySelectorAll(".brands-filter-item");
    let categoriesFilters = document.querySelectorAll(".category-filter-item");
    resetCheckbox(brandsFilters);
    resetCheckbox(categoriesFilters);
    let reviewsFilter = document.getElementById("reviews-range-sllider");
    reviewsFilter.value = 1;
    showProducts(productsArray);
  }
  function resetCheckbox(arrayName) {
    for (let item of arrayName) {
      item.checked = false;
    }
  }

  inCardProductsShow();


  const url = window.location.pathname;
  if (url == "/store.html") {
    showProducts(productsArray);
    showProductsFilter("Category", "category-filter", categoriesArray, "category-filter-item");
    showProductsFilter("Brands", "brands-filter", brandsArray, "brands-filter-item");
    showReviews();
    var sortingPlaceholder = document.getElementById("sort-product-placeholder");
    sortingPlaceholder.addEventListener("change", function () {
      let productsArray = jsonParse("productsLocal");
      productsArray.sort(function (a, b) {
        if (sortingPlaceholder.value == 0) {
          return 0;
        } else if (sortingPlaceholder.value == 1) {
          a = parseFloat(priceCalculator(a.price.old, a.price.discount));
          b = parseFloat(priceCalculator(b.price.old, b.price.discount));
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          if (a == b) {
            return 0;
          }
        } else if (sortingPlaceholder.value == 2) {
          a = parseFloat(priceCalculator(a.price.old, a.price.discount));
          b = parseFloat(priceCalculator(b.price.old, b.price.discount));
          if (a > b) {
            return -1;
          }
          if (a < b) {
            return 1;
          } else {
            return 0;
          }
        } else if (sortingPlaceholder.value == 3) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          } else {
            return 0;
          }
        } else if (sortingPlaceholder.value == 4) {
          if (a.name > b.name) {
            return -1;
          }
          if (a.name < b.name) {
            return 1;
          } else {
            return 0;
          }
        }
      });
      showProducts(productsArray);
    });
    let resetBtn = document.getElementById("reset-filter");
    resetBtn.addEventListener("click", resetFilters);
  } else if (url == "/index.html") {
    topDiscountProducts(productsArray);
  }
  function topDiscountProducts(productsArray) {
    let filteredDiscount = productsArray.filter(function (el) {
      return el.price.discount >= 50;
    });
    showProducts(filteredDiscount);
  }
};
