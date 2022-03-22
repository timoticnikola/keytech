window.onload = () => {
  function ajaxCallBack(fileName, callBack, localName) {
    $.ajax({
      type: "GET",
      url: "assets/data/" + fileName + ".json",
      dataType: "JSON",
      success: function (response) {
        callBack(response, localName);
      },
      error: function (err) {
        console.log(err);
      },
    });
  }
  ajaxCallBack("navLinks", createLocal, "navLinksArray");
  ajaxCallBack("category", createLocal, "categoryArray");
  ajaxCallBack("socialLinks", createLocal, "socialLinksArray");
  ajaxCallBack("products", createLocal, "productsArray");
  ajaxCallBack("brand", createLocal, "brandArray");
  ajaxCallBack("documentLinks", createLocal, "documentLinksArray");
  createNavBar();
  createFooter();

  function createLocal(response, localName) {
    localStorage.setItem(`${localName}`, JSON.stringify(response));
  }

  function createNavBar() {
    let navLinksArray = JSON.parse(localStorage.getItem("navLinksArray"));
    navLinks("nav-warpper", navLinksArray);
    navLinkShop("nav");
  }

  function navLinkShop(ulID) {
    let ulTag = document.getElementById(`${ulID}`);
    let liTag = document.createElement("li");
    let iTag = document.createElement("i");
    iTag.setAttribute("class", "fa-solid fa-basket-shopping");
    liTag.appendChild(iTag);
    ulTag.appendChild(liTag);
  }

  function navLinks(id, navLinksArray) {
    let container = document.getElementById(`${id}`);
    let ulTag = document.createElement("ul");
    ulTag.setAttribute("id", "nav");
    for (let link of navLinksArray) {
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
  let productsArray = jsonParse("productsArray");
  showProducts(productsArray);
  function showProducts(productsArray) {
    let html = "";
    let container = document.getElementById("products");
    for (let product of productsArray) {
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
            <input class="product-add-to-card-btn" type="button" value="Add to card" />
          </div>`;
    }
    container.innerHTML = html;
  }
  function showBrand(brandID) {
    let html = "";
    let brandArray = jsonParse("brandArray");
    for (let brand of brandArray) {
      if (brand.id == brandID) {
        html += `${brand.name}`;
      }
    }
    return html;
  }
  function showBrandsCategory() {
    let html = "";
    html += `<p>Brands</p>
          <ul>`;
    let container = document.getElementById("brands-filter");
    let brandArray = jsonParse("brandArray");
    for (let brand of brandArray) {
      html += `<li>
              <input type="checkbox" name="" id="" />
              <label for="">${brand.name} [${countProductsBy("productsArray", "brandID", brand.id)}]</label>
            </li>`;
    }
    html += `</ul>`;
    container.innerHTML = html;
  }

  function countProductsBy(itemArrayName, nameID, compereID) {
    let countProduct = 0;
    let itemArray = jsonParse(`${itemArrayName}`);
    for (let item of itemArray) {
      if (item[nameID] == compereID) {
        countProduct++;
      }
    }
    return countProduct;
  }
  showProductsCategory();
  function showProductsCategory() {
    let html = "";
    html += `<p>Category</p>
          <ul>
            <li>
                <input type="radio" name="" id="">
                <label for="">Any type</label>
            </li>`;
    let container = document.getElementById("category-filter");
    let categoryArray = jsonParse("categoryArray");
    for (let category of categoryArray) {
      html += `<li>
                <input type="radio" name="" id="">
                <label for="">${category.name} [${countProductsBy("productsArray", "categoryID", category.id)}]</label>
              </li>`;
    }
    html += `</ul>`;
    container.innerHTML = html;
  }
  showBrandsCategory();

  function createFooter() {
    let navLinksArray = JSON.parse(localStorage.getItem("navLinksArray"));
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
    navLinks("footer-navlinks", navLinksArray);
  }
  function jsonParse(localName) {
    let parsed = JSON.parse(localStorage.getItem(`${localName}`));
    return parsed;
  }

  var sortingPlaceholder = document.getElementById("sort-product-placeholder");
  sortingPlaceholder.addEventListener("change", function () {
    let productsArray = jsonParse("productsArray");
    productsArray.sort(function (a, b) {
      if (sortingPlaceholder.value == 0) {
        return 0;
      } else if (sortingPlaceholder.value == 1) {
        if (a.price.new < b.price.new) {
          return -1;
        }
        if (a.price.new > b.price.new) {
          return 1;
        }
        if (a.price.new == b.price.new) {
          return 0;
        }
      } else if (sortingPlaceholder.value == 2) {
        if (a.price.new > b.price.new) {
          return -1;
        }
        if (a.price.new < b.price.new) {
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
};
