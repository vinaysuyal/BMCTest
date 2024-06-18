function populateCard(
  logoSrc,
  heading,
  content,
  buttonText = "View",
  append = true
) {
  var card = document.createElement("div");
  card.classList.add("card");

  var cardLogo = document.createElement("div");
  cardLogo.classList.add("card-logo");
  var logoImg = document.createElement("img");
  logoImg.src = logoSrc;
  logoImg.alt = "Company Logo";
  cardLogo.appendChild(logoImg);
  card.appendChild(cardLogo);

  var cardContent = document.createElement("div");
  cardContent.classList.add("card-content");
  var headingElem = document.createElement("h2");
  headingElem.textContent = heading;
  var paragraph = document.createElement("p");
  paragraph.textContent = content;
  cardContent.appendChild(headingElem);
  cardContent.appendChild(paragraph);
  card.appendChild(cardContent);

  var cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");
  var viewButton = document.createElement("button");
  viewButton.classList.add("view-button");
  viewButton.textContent = buttonText;
  cardFooter.appendChild(viewButton);
  card.appendChild(cardFooter);

  var container = document.getElementById("story-container");
  if (!append) container.innerHTML = "";
  container.appendChild(card);
}

function createCompanySizePopulator() {
  const checked = new Set();
  return function populateCompanySizes(companySizes) {
    var filterCompanysize = document.getElementById("filter_companysize");

    filterCompanysize.innerHTML = "<h3>Company Size</h3>";

    companySizes.forEach(function (size) {
      var checkboxContainer = document.createElement("div");
      checkboxContainer.classList.add("checkbox-container");

      var checkboxLabel = document.createElement("label");
      checkboxLabel.classList.add("checkbox-label");

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = size;
      checkbox.id = size.toLowerCase();
      checkbox.addEventListener("change", function () {
        if (this.checked) {
          checked.add(size);
          populateFilterTags([...checked]);
          populate(null, [...checked]);
        } else {
          checked.delete(size);
          populateFilterTags([...checked]);
          populate(null, [...checked]);
        }
      });

      var labelText = document.createTextNode(size);

      checkboxLabel.appendChild(checkbox);
      checkboxLabel.appendChild(labelText);
      checkboxContainer.appendChild(checkboxLabel);
      filterCompanysize.appendChild(checkboxContainer);
    });
  };
}

function createPopulator() {
  let list = [];
  const populate = (results, filters) => {
    if (filters.length === 0) {
      addFilterTag("No Filters Applied");
      let append = false;
      if (results) list = results;
      const companySizes = new Set();
      list.forEach((result) => {
        const data = result.metadata.find(
          (data) => data.id === "ic-company-size"
        );
        if (data && data.displayValue) companySizes.add(data.displayValue);
        populateCard(
          `https://www.bmc.com${result.headerImage}`,
          "Customer Story",
          result.description,
          "View",
          append
        );
        append = true;
      });
      populateCompanySizes([...companySizes]);
    } else {
      let append = false;
      list.forEach((result) => {
        const data = result.metadata.find(
          (data) => data.id === "ic-company-size"
        );
        if (data && data.displayValue) {
          if (filters.includes(data.displayValue)) {
            populateCard(
              `https://www.bmc.com${result.headerImage}`,
              "Customer Story",
              result.description,
              "View",
              append
            );
            append = true;
          }
        }
      });
    }
  };
  return populate;
}

const populate = createPopulator();

const populateCompanySizes = createCompanySizePopulator();

function fetchAndPopulate(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      results = data.results;
      populate(results, []);
    })
    .catch((error) =>
      console.error("There was a problem with the fetch operation:", error)
    );
}

function addFilterTag(filterName) {
  var filterDisplay = document.getElementById("filterDisplay");

  var tag = document.createElement("div");
  tag.classList.add("filter-tag");

  var tagText = document.createElement("span");
  tagText.textContent = filterName;
  tag.appendChild(tagText);

  filterDisplay.appendChild(tag);
}

function populateFilterTags(filterList) {
  var filterDisplay = document.getElementById("filterDisplay");

  filterDisplay.innerHTML = "";

  filterList.forEach(function (filter) {
    addFilterTag(filter);
  });
}

window.onload = () => {
  const url =
    "https://www.bmc.com/bin/contentapi/content?rootPath=/content/bmc/language-masters/en/customers&product_interest=981173424,244922277,215078746,163366495,940824846,499579858,507778250,145457443,762200338,794729560,248677372,174236796,180034581,438283521,788612595,004182175,549295455,113394324,642178370,212041549&sortCriteria=recommended&category=rc";
  fetchAndPopulate(url);
};
