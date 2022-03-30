window.onload = () => {

  jsonRequest("navLinks", createNavBar);
  jsonRequest("products", showProducts);
  // jsonRequest("category");
  // jsonRequest("socialLinks");
  // jsonRequest("products");
  // jsonRequest("brand");
  // jsonRequest("documentLinks");
  function jsonRequest(fileName, functionName) {
    var htReq = new XMLHttpRequest();
    htReq.open("GET", `assets/data/${fileName}.json`, true);
    htReq.send();
    htReq.onreadystatechange = function () {
      if (htReq.readyState == 4 && htReq.status == 200) {
        // console.log(1);
        const array = JSON.parse(htReq.responseText);
        localStorage.setItem(`${fileName}Local`, JSON.stringify(array));
        functionName(array);
      }
    }
  }

  // Run functions
  // console.log(localStorage.getItem("navLinksLocal"));
  // createNavBar("navLinksLocal");
  // createFooter("navLinksLocal");

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
  // showProducts(productsLocal);
  function showProducts(productsLocal) {
    let html = "";
    let container = document.getElementById("products");
    for (let product of productsLocal) {
      html += `<div class="product">
              <img src="assets/img/test.webp" alt="photo" />
              <p class="product-category-name">categoryName</p>
              <p class="product-brandname">${showBrand(product.brandID)}</p>
              <p class="product-name">${product.name}</p>
              <p class="product-description">${product.descript}</p>
              <div class="product-price">
                <p>Price:</p>
                <p class="product-price-new">${product.price.new}</p>
                <s class="product-price-old">${product.price.old}</s>
              </div>
              <p class="product-reviews">Reviews: ${product.score}</p>
              <input class="product-add-to-card-btn" type="button" data-id="${product.id}" value="Add to card" />
            </div>`;
    }
    container.innerHTML = html;
  }
  function retrunJson(data) {

    return 1;
  }
  function showBrand(brandID) {
    let html = "";
    var test = jsonRequest("brands", retrunJson);
    console.log(test);
    return html;
  }
  // function showBrandsCategory() {
  //   let html = "";
  //   html += `<p>Brands</p>
  //           <ul>`;
  //   let container = document.getElementById("brands-filter");
  //   let brandArray = jsonParse("brandLocal");
  //   for (let brand of brandArray) {
  //     html += `<li>
  //               <input type="checkbox" name="${brand.name}" id="${brand.name}" class="brands-filter-item" />
  //               <label for="${brand.name}">${brand.name} [${countProductsBy("productsLocal", "brandID", brand.id)}]</label>
  //             </li>`;
  //   }
  //   html += `</ul>`;
  //   container.innerHTML = html;
  // }

  // function countProductsBy(itemArrayName, nameID, compereID) {
  //   let countProduct = 0;
  //   let itemArray = jsonParse(`${itemArrayName}`);
  //   for (let item of itemArray) {
  //     if (item[nameID] == compereID) {
  //       countProduct++;
  //     }
  //   }
  //   return countProduct;
  // }
  // showProductsCategory();
  // function showProductsCategory() {
  //   let html = "";
  //   html += `<p>Category</p>
  //           <ul>
  //             <li>
  //                 <input type="radio" name="categoryRadio" value="any" class="categoryRadioAny category-filter-item" id="categoryRadioAny" checked="checked">
  //                 <label for="categoryRadioAny">Any type</label>
  //             </li>`;
  //   let container = document.getElementById("category-filter");
  //   let categoryArray = jsonParse("categoryLocal");
  //   for (let category of categoryArray) {
  //     html += `<li>
  //                 <input type="radio" name="categoryRadio" class="categoryRadioAny category-filter-item" value="${category.name}" id="${category.name}">
  //                 <label for="${category.name}">${category.name} [${countProductsBy("productsLocal", "categoryID", category.id)}]</label>
  //               </li>`;
  //   }
  //   html += `</ul>`;
  //   container.innerHTML = html;
  // }
  // showBrandsCategory();

  // function createFooter(data) {
  //   let navLinksArray = JSON.parse(localStorage.getItem(`${data}`));
  //   let footerId = document.getElementById("footer");
  //   let footerWrapper = document.createElement("div");
  //   footerWrapper.setAttribute("class", "wrapper");
  //   let footerTop = document.createElement("div");
  //   let footerNavLinks = document.createElement("div");
  //   footerNavLinks.setAttribute("id", "footer-navlinks");
  //   let footerNavLinksP = document.createElement("p");
  //   let footerNavLinksPContent = document.createTextNode("Navigation");
  //   footerNavLinksP.appendChild(footerNavLinksPContent);
  //   footerNavLinks.appendChild(footerNavLinksP);
  //   footerTop.appendChild(footerNavLinks);
  //   footerTop.setAttribute("id", "footer-top");
  //   let footerBottom = document.createElement("div");
  //   let footerCopyright = document.createElement("p");
  //   let footerCopyrightContent = document.createTextNode("© Copyright 2022");
  //   footerCopyright.appendChild(footerCopyrightContent);
  //   footerBottom.appendChild(footerCopyright);
  //   footerBottom.setAttribute("id", "footer-top");
  //   footerWrapper.appendChild(footerTop);
  //   footerWrapper.appendChild(footerBottom);
  //   footerId.appendChild(footerWrapper);
  //   navLinks("footer-navlinks", navLinksArray);
  // }
  function jsonParse(localName) {
    let parsed = JSON.parse(localStorage.getItem(`${localName}`));
    return parsed;
  }

  // var sortingPlaceholder = document.getElementById("sort-product-placeholder");
  // sortingPlaceholder.addEventListener("change", function () {
  //   let productsArray = jsonParse("productsLocal");
  //   productsArray.sort(function (a, b) {
  //     if (sortingPlaceholder.value == 0) {
  //       return 0;
  //     } else if (sortingPlaceholder.value == 1) {
  //       if (a.price.new < b.price.new) {
  //         return -1;
  //       }
  //       if (a.price.new > b.price.new) {
  //         return 1;
  //       }
  //       if (a.price.new == b.price.new) {
  //         return 0;
  //       }
  //     } else if (sortingPlaceholder.value == 2) {
  //       if (a.price.new > b.price.new) {
  //         return -1;
  //       }
  //       if (a.price.new < b.price.new) {
  //         return 1;
  //       } else {
  //         return 0;
  //       }
  //     } else if (sortingPlaceholder.value == 3) {
  //       if (a.name < b.name) {
  //         return -1;
  //       }
  //       if (a.name > b.name) {
  //         return 1;
  //       } else {
  //         return 0;
  //       }
  //     } else if (sortingPlaceholder.value == 4) {
  //       if (a.name > b.name) {
  //         return -1;
  //       }
  //       if (a.name < b.name) {
  //         return 1;
  //       } else {
  //         return 0;
  //       }
  //     }
  //   });
  //   showProducts(productsArray);
  // });



  // // const url = window.location.pathname;
  // // if (url == "/store.html") {
  // // }
  // localStorage.removeItem("productsArrayFiltered");

  // // Test shopping-card-container
  // let shoppingCard = document.getElementById("shopping-card");
  // shoppingCard.addEventListener("click", function () {
  //   let shoppingCardContainer = document.querySelector(".shopping-card-container");
  //   shoppingCardContainer.classList.add("shopping-card-active");
  // });
  // let shoppingCardClose = document.getElementById("card-close");
  // shoppingCardClose.addEventListener("click", function () {
  //   let shoppingCardContainer = document.querySelector(".shopping-card-container");
  //   shoppingCardContainer.classList.remove("shopping-card-active");
  // });
  // // Add to card
  // const addToCardBtnsList = document.querySelectorAll(".product-add-to-card-btn");
  // for (let addToCardBtn of addToCardBtnsList) {
  //   addToCardBtn.addEventListener("click", function () {
  //     let dataID = this.getAttribute("data-id");
  //     if (localStorage.getItem("addToCardList")) {
  //       let addToCardList = jsonParse("addToCardList");
  //       if (addToCardList.filter((e) => e.id == dataID).length) {
  //         cardMessages("Product already in card!");
  //       } else {
  //         addToCardList.push({
  //           id: dataID,
  //           quantity: 1,
  //         });
  //         cardMessages("Product added to card!");
  //         localStorage.setItem("addToCardList", JSON.stringify(addToCardList));
  //       }
  //     } else {
  //       let jsonTe = [];
  //       jsonTe[0] = {
  //         id: dataID,
  //         quantity: 1,
  //       };
  //       localStorage.setItem("addToCardList", JSON.stringify(jsonTe));
  //     }
  //     inCardCount();
  //     inCardProductsShow();
  //     classGe();
  //   });
  // }

  // // Add to card message
  // function cardMessages(text) {
  //   let messageDivTest = document.querySelector(".message");
  //   if (messageDivTest) {
  //     messageDivTest.parentNode.removeChild(messageDivTest);
  //   }
  //   let messageDiv = document.createElement("div");
  //   messageDiv.setAttribute("class", "message");
  //   let pTag = document.createElement("p");
  //   let pTagContent = document.createTextNode(`${text}`);
  //   pTag.appendChild(pTagContent)
  //   messageDiv.appendChild(pTag);
  //   let bodyTag = document.getElementsByTagName("body");
  //   bodyTag[0].appendChild(messageDiv);
  //   var clearElement = setInterval(() => {
  //     if (messageDiv.parentElement == null) {
  //       clearInterval(clearElement);
  //     } else {
  //       messageDiv.parentElement.removeChild(messageDiv);
  //     }
  //   }, 5000);
  // }

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
  // // InCardProducts
  // function inCardProductsShow() {
  //   let addToCardList = jsonParse("addToCardList");
  //   // console.log(addToCardList);
  //   let container = document.getElementById("card-products");
  //   container.innerHTML = "";
  //   if (addToCardList != null) {
  //     for (let item of addToCardList) {
  //       // console.log(item);
  //       let cardProdict = document.createElement("div");
  //       cardProdict.setAttribute("class", "card-product");
  //       let imgContainer = document.createElement("img");
  //       imgContainer.setAttribute("src", "assets/img/test.webp");
  //       imgContainer.setAttribute("alt", "img");
  //       cardProdict.appendChild(imgContainer);
  //       let cardProduictsRight = document.createElement("div");
  //       cardProduictsRight.setAttribute("class", "card-product-right");
  //       cardProdict.appendChild(cardProduictsRight);
  //       let pProductName = document.createElement("p");
  //       // let pProductNameContent = document.createTextNode(`ProductName`);
  //       let pProductNameContent = document.createTextNode(`${showInCardProductData(item.id, "name")}`);
  //       // let pProductNameContent = document.createTextNode(`${showProductName(item.id)}`);
  //       // showProductName
  //       // showInCardProductData
  //       // console.log(item.id);
  //       pProductName.appendChild(pProductNameContent);
  //       cardProduictsRight.appendChild(pProductName);
  //       let pBrandName = document.createElement("p");
  //       let pPBrandNameContent = document.createTextNode(`BrandName`);
  //       pBrandName.appendChild(pPBrandNameContent);
  //       cardProduictsRight.appendChild(pBrandName);
  //       let pProductPrice = document.createElement("p");
  //       let pProductPriceContent = document.createTextNode(`${showInCardProductData(item.id, "price", "new")}`);
  //       pProductPrice.appendChild(pProductPriceContent);
  //       cardProduictsRight.appendChild(pProductPrice);
  //       let cardProductTools = document.createElement("div");
  //       cardProductTools.setAttribute("class", "card-product-tools");
  //       cardProduictsRight.appendChild(cardProductTools);
  //       let cardProductQuantity = document.createElement("div");
  //       cardProductQuantity.setAttribute("class", "card-product-quantity");
  //       // Minus
  //       let inputValueMinus = document.createElement("input");
  //       inputValueMinus.setAttribute("type", "button");
  //       inputValueMinus.setAttribute("class", "quantityRegul");
  //       inputValueMinus.setAttribute("data-id", `${item.id}`);
  //       inputValueMinus.setAttribute("value", "-");
  //       cardProductQuantity.appendChild(inputValueMinus);
  //       // PTag
  //       let itemQuantity = document.createElement("p");
  //       let itemQuantityContent = document.createTextNode(`${item.quantity}`);
  //       itemQuantity.appendChild(itemQuantityContent);
  //       cardProductQuantity.appendChild(itemQuantity);
  //       // Plus
  //       let inputValuePlus = document.createElement("input");
  //       inputValuePlus.setAttribute("type", "button");
  //       inputValuePlus.setAttribute("class", "quantityRegul");
  //       inputValuePlus.setAttribute("data-id", `${item.id}`);
  //       inputValuePlus.setAttribute("value", "+");
  //       cardProductQuantity.appendChild(inputValuePlus);
  //       // Append to cardProductTools
  //       cardProductTools.appendChild(cardProductQuantity)
  //       // iTag
  //       let iBin = document.createElement("i");
  //       iBin.setAttribute("class", "fa fa-trash");
  //       iBin.setAttribute("data-id", `${item.id}`);
  //       iBin.setAttribute("aria-hidden", "true");
  //       cardProductTools.appendChild(iBin);
  //       container.appendChild(cardProdict);
  //     }
  //   }
  //   else {
  //     cardMessages("Deleted all products from card");
  //     let pTag = document.createElement("p");
  //     let pTagContent = document.createTextNode("Card is empty.");
  //     pTag.appendChild(pTagContent);
  //     pTag.setAttribute("id", "empty-card");
  //     container.appendChild(pTag);
  //     console.log("Empty");
  //   }
  //   deleteProducts();
  //   inCardCount();
  // }
  // inCardProductsShow();
  // classGe();

  // function showInCardProductData(itemID, objectName, objectName2 = null) {
  //   // console.log(itemID);
  //   let productsArray = jsonParse("productsLocal");
  //   let productName = productsArray.filter(function (el) {
  //     return el.id == itemID;
  //   });
  //   let test = objectName;
  //   // console.log(test);
  //   // console.log(productName[0].name);
  //   if (objectName2 != null) {
  //     // console.log(productName[0][objectName][objectName2]);
  //     return productName[0][objectName][objectName2];
  //   } else {
  //     // console.log(productName[0][objectName]);
  //     return productName[0][objectName];
  //   }
  // }

  // function classGe() {
  //   let quantityRegulList = document.querySelectorAll(".quantityRegul");
  //   // console.log(test);
  //   for (let item of quantityRegulList) {
  //     item.addEventListener("click", function () {
  //       let dataQuantity = jsonParse("addToCardList");
  //       // console.log(this.value);
  //       // console.log(this.parentElement.getElementsByTagName("p").innerHTML);
  //       if (this.value == "+") {
  //         // console.log(dataQuantity);
  //         for (let data of dataQuantity) {
  //           if (data.id == this.getAttribute("data-id")) {
  //             // console.log(data.id);
  //             data.quantity += 1;
  //             localStorage.setItem("addToCardList", JSON.stringify(dataQuantity));
  //             this.parentElement.getElementsByTagName("p")[0].innerHTML = data.quantity;
  //             // console.log(data.quantity);
  //           }
  //         }
  //       } else {
  //         for (let data of dataQuantity) {
  //           if (data.id == this.getAttribute("data-id")) {
  //             if (data.quantity > 1) {
  //               data.quantity -= 1;
  //               localStorage.setItem("addToCardList", JSON.stringify(dataQuantity));
  //               this.parentElement.getElementsByTagName("p")[0].innerHTML = data.quantity;
  //               // console.log(data.quantity);
  //             } else {
  //               // ! obrisati proizvod
  //               // data.quantity -= 1;
  //               // localStorage.setItem("addToCardList", JSON.stringify(dataQuantity));
  //               // console.log(data.quantity);

  //             }
  //           }
  //         }
  //       }
  //       // ! Promeniti na create element 
  //       // ! Mora da se azurira samo p tag
  //       // inCardProductsShow();
  //     });
  //   }
  // }
  // function deleteProducts() {
  //   let binItems = document.querySelectorAll(".fa-trash");
  //   // console.log(binItems);
  //   for (let item of binItems) {
  //     item.addEventListener("click", () => {
  //       let addToCardList = jsonParse("addToCardList");
  //       // console.log(addToCardList);
  //       for (let data of addToCardList) {
  //         if (data.id == item.getAttribute("data-id")) {
  //           let filteredList = addToCardList.filter(function (el) {
  //             return el.id !== `${data.id}`;
  //           });
  //           localStorage.setItem("addToCardList", JSON.stringify(filteredList));
  //         }
  //       }
  //       if (jsonParse("addToCardList").length == 0) {
  //         localStorage.removeItem("addToCardList");
  //       }
  //       inCardProductsShow();
  //       cardMessages("Product deleted from card!");
  //     });
  //   }
  // }
  // function deleteAllProducts() {
  //   document.getElementById("delete-all-products").addEventListener("click", () => {

  //     localStorage.removeItem("addToCardList");
  //     inCardProductsShow();
  //   });
  // }
  // deleteAllProducts();
  // let brandsFilterItem = document.querySelectorAll(".brands-filter-item");
  // for (let item of brandsFilterItem) {
  //   item.addEventListener("change", filterAllData);
  // }

  // let categoryFilterItem = document.querySelectorAll(".category-filter-item");
  // for (let item of categoryFilterItem) {
  //   item.addEventListener("change", filterAllData);
  // }

  // let reviewsSlider = document.getElementById("reviews-range-sllider");
  // reviewsSlider.addEventListener("change", filterAllData);
  // // Filter all data
  // function filterAllData() {
  //   let allProducts = jsonParse("productsArray");
  //   console.log(this.type);
  //   console.log(allProducts);
  //   let categoryFilterSelected = "any";
  //   let rangeReview = 1;
  //   let brandFilterSelected = [];
  //   let filteredData;
  //   if (this.type == "radio") {
  //     categoryFilterSelected = this.value;
  //   }
  //   if (this.type == "range") {
  //     rangeReview = this.value / 10;
  //     console.log(`Test: ${this.value}`);
  //   }
  //   if (this.type == "checkbox") {
  //     if (this.checked) {
  //       console.log("checked");
  //       brandFilterSelected.push(`${this.name}`)
  //     } else {
  //       console.log("unchecked");
  //       brandFilterSelected.filter((e) => e != `${this.name}`);
  //     }
  //   }
  //   if (categoryFilterSelected != "any") {
  //     console.log(`Your category is: ${this.value}`);
  //     filteredData = allProducts.filter(function (el) {
  //       return el.categoryID == 1;
  //       // moramo dodati filtriranje u odnosu na listuKategorija iz JSON fajla.
  //     });
  //   }
  //   if (rangeReview >= 1) {
  //     filteredData = allProducts.filter(function (el) {
  //       console.log(el.score >= rangeReview);
  //       return el.score >= rangeReview;
  //       // moramo dodati filtriranje u odnosu na listuKategorija iz JSON fajla.
  //     });
  //   }
  //   if (brandFilterSelected.length != 0) {
  //     console.log(brandFilterSelected);
  //     console.log("You have selected some brands");
  //     // moramo izmeniti
  //   }
  //   console.log(filteredData);
  //   console.log("Execute confirm");
  //   showProducts(filteredData);
  // }


};