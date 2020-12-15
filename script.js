const API_KEY = "324e5aaa";

$(document).ready(function () {
  // Očisti sve inpute kada fokusiramo title input
  $("#title-input").on("focusin", clearInputs);

  $("form").submit((e) => {
    e.preventDefault();

    // Isprazni div u koji treba smjestiti rezultate (ako je već nešto bilo)
    $(".search-result").empty();

    showSpinner();
    const url = createURL();
    callAPI(url);
  });
});

// Funkcija koja kreira url od podataka dobijenih iz forme
function createURL() {
  const title = $("#title-input").val();
  const type = $("#type").val();
  const year = $("#year").val();
  const url = `https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}&type=${type}${
    !year ? "" : "&y=" + year
  }`;
  return url;
}

// Funkcija koja odrađuje AJAX poziv
function callAPI(url) {
  $.ajax({
    type: "GET",
    url: url,
    success: (response) => {
      render(response);
    },
    error: (err) => {
      console.error(err);
    },
  });
}

// Funkcija koja renderuje rezultat ili grešku
function render(res) {
  const markup = generateMarkup(res);

  // Sakrij div sa rezultatima (dok se sve ne učita)
  $(".search-result").hide();
  $(".fa-spinner").addClass("margin-bottom");
  $(".search-result").append(markup);

  // Ako nema rezultata
  if (res.Response === "False") {
    removeSpinner();
    $(".search-result").show();
    return;
  }

  // Čekanje na učitavanje slike prije nego prikažemo cio div
  $("img")
    .one("load", function () {
      // Klasa koja animira formu po pojavljivanju rezultata
      $(".container").removeClass("empty");
      removeSpinner();
      $(".search-result").show();
    })
    .each(function () {
      if (this.complete) {
        $(this).trigger("load");
      }
    });
}

// Funkcija koja uzima podatke koje API vrati i generiše markup koji kasnije
// dodajemo (ili poruku da nema rezultata) u render() funkciji
function generateMarkup(res) {
  if (res.Response === "False") {
    return `
      <h2 class="error">Nema rezultata Vaše pretrage u bazi. Probajte nešto drugo!</h2> 
    `;
  }
  return `
    <div class="img-container">
      <img src="${
        res.Poster !== "N/A" ? res.Poster : "./img/default-poster.png"
      }" 
        alt="${res.Title} poster"
      />
    </div>
    <table>
    <tbody>
      <tr>
        <th>Naslov:</th>
        <td>${res.Title}</td>
      </tr>
      <tr>
        <th>Godina:</th>
        <td>${res.Year}</td>
      </tr>
      <tr>
        <th>Datum objavljivanja:</th>
        <td>${res.Released}</td>
      </tr>
      <tr>
        <th>Trajanje:</th>
        <td>${res.Runtime}</td>
      </tr>
      <tr>
        <th>Režiser:</th>
        <td>${res.Director}</td>
      </tr>
      <tr>
        <th>Glumci:</th>
        <td>${res.Actors}</td>
      </tr>
      <tr>
        <th>Radnja:</th>
        <td>${res.Plot}</td>
      </tr>
      ${
        res.Type === "series"
          ? `<tr>
        <th>Broj sezona:</th>
        <td>${res.totalSeasons}</td>
      </tr>`
          : ""
      }
      <tr>
        <th>Ocjene gledalaca:</th>
        <td>
          <table class="ratings-table">
            <tbody>
            ${res.Ratings.map((rating) => {
              return `
                <tr>
                  <td>${rating.Source}</td>
                  <td>${rating.Value}</td>
                </tr>
              `;
            }).join("")}
            </tbody>
          </table>
        </td>
      </tr>
      </tbody>
    </table>
  `;
}

// Helper - prikazuje spinner
function showSpinner() {
  $(".spinner-container").empty();
  $(".spinner-container").append(
    "<i class='fas fa-spinner fa-spin fa-3x'></i>"
  );
}

// Helper - uklanja  spinner
function removeSpinner() {
  $(".spinner-container").empty();
}

// Helper - očisti inpute
function clearInputs() {
  $("#title-input").val("");
  $("#year").val("");
}
