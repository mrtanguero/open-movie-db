const API_KEY = "324e5aaa";

$(document).ready(function () {
  $("form").submit((e) => {
    e.preventDefault();
    const url = createURL();
    callAPI(url);
  });
});

function createURL() {
  const title = $("#title-input").val();
  if (!title) return;

  const type = $("#type").val();
  const year = $("#year").val();
  const url = `http://www.omdbapi.com/?apikey=${API_KEY}&t=${title}&type=${type}${
    !year ? "" : "&y=" + year
  }`;
  return url;
}

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

function render(res) {
  const markup = generateMarkup(res);
  $(".search-result").empty();
  $(".search-result").append(markup);
}

function generateMarkup(res) {
  if (res.Response === "False") {
    return `
      <h2 class="error col-8 offset-2">Nema rezultata Vaše pretrage u bazi. Probajte nešto drugo!</h2> 
    `;
  }
  return `
    <div class="img-container">
      <img src="${res.Poster}" alt="${res.Title} poster">
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
