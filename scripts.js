// ----------------------------------
/* update as appropriate when school terms dates are released for the next academic year
   dates must be in format MM/DD/YYYY */

const year_1 = "2022";
const year_2 = "2023";

const bank_holidays = [
new Date("12/26/2022"),
new Date("12/27/2022"),
new Date("01/02/2023"),
new Date("04/07/2023"),
new Date("04/10/2023"),
new Date("05/01/2023"),
new Date("05/29/2023"),
new Date("08/29/2023")
];

const summer_hols_year_1 = [new Date("08/31/2022"), new Date("09/05/2022")];
const autumn_half_term = [new Date ("10/24/2022"), new Date("10/28/2022")];
const winter_hols = [new Date("12/19/2022"), new Date("01/03/2023")];
const spring_half_term = [new Date("02/13/2023"), new Date("02/17/2023")];
const easter_hols = [new Date("03/31/2023"), new Date ("04/17/2023")];
const summer_half_term = [new Date("05/29/2023"), new Date ("06/02/2023")];
const summer_hols_year_2 = [new Date("07/25/2023"), new Date("09/04/2023")];

// ----------------------------------

const school_hols = [summer_hols_year_1, autumn_half_term, winter_hols, spring_half_term, easter_hols, summer_half_term, summer_hols_year_2];

const months = {
  0 : "january",
  1 : "february",
  2 : "march",
  3 : "april",
  4 : "may",
  5 : "june",
  6 : "july",
  7 : "august",
  8 : "september",
  9 : "october",
  10 : "november",
  11 : "december",
}

class Month {
  constructor(year, month) {
    /* JS weeks are indexed 0-6 from Sun-Sat by default.
       Our calendar runs Mon-Sun, so we need our weeks to be indexed 0-6 from Mon-Sun.
       Our new index is used to define each Month's first_day_integer  */
    this.week_days = {
      1 : 0,
      2 : 1,
      3 : 2,
      4 : 3,
      5 : 4,
      6 : 5,
      0 : 6
    }
    this.name = months[month];
    // passing 0 in as the value for day gives us the last day of the previous month, hence why we are passing in month + 1
    this.days_in_month = new Date(year, month + 1, "0").getDate();
    // // integer (0-6) of the first day of the month (ie Mon, Tues)
    this.first_day_integer = this.week_days[new Date(year, month, "1").getDay()];
  }
}

// appends academic year to the title of each month's label
const add_calendar_year = (year_1, year_2) => {
  let month_lables = document.querySelectorAll(".calendar__month--label span");

  // Sept-Dec year 1
  for (let i = 0; i < 4; i++) {
    month_lables[i].innerHTML += (" " + year_1);
  }
  // Jan-August year 2
  for (let x = 4; x < 12; x++) {
    month_lables[x].innerHTML += (" " + year_2);
  }
}


// returns array of Month objects ordered by academic year
const create_academic_year = (year_1, year_2) => {
  let arr = [];

  // Sept-Dec year 1
  for (let i = 8; i < 12; i++) {
    arr.push(new Month(year_1, i));
  }
  // Jan-August year 2
  for (let x = 0; x < 8; x++) {
    arr.push(new Month(year_2, x));
  }

  return arr;
}

/* returns a nested array of each month's <td> elements, ordered by academic year
   each month <table> has a corresponding css class used as selector */
const create_calendar_table_cells = () => {
  let arr = [];

  // Sept-Dec
  for (let i = 8; i < 12; i++) {
    arr.push(document.querySelectorAll("#" + months[i] + " td"));
  }
  // Jan-August
  for (let x = 0; x < 8; x++) {
    arr.push(document.querySelectorAll("#" + months[x] + " td"));
  }

  return arr;
}


const is_bank_holiday = (date) => {
  for (let i = 0; i < bank_holidays.length; i++) {
    if (date.getTime() == bank_holidays[i].getTime()) {
      return true;
    }
  }
}

// checks if date passed in is within any of the date ranges passed in
const is_school_holiday = (date, ranges) => {
  for (let i = 0; i < ranges.length; i++) {
      let [range_start, range_end] = [ranges[i][0], ranges[i][1]];
      if (date.getTime() >= range_start.getTime() && date.getTime() <= range_end.getTime()) {
        return true;
    }
  }
}

add_calendar_year(year_1, year_2);

const academic_year = create_academic_year(year_1, year_2);
const calendar_tds = create_calendar_table_cells();

// our calendar will always start on 1 Sept year_1, so we start the loop of on that date
let current_loop_date = new Date("09/01/" + year_1);

/* we loop through each month's table cells in the calendar, assigning each table cell a css class based on:
  - if the day is a weekend, bank or school holiday
  - if the table cell is outside either the start or end of the month (ie Mon - Weds if the month starts on a Thurs)
   we also populate all cells between the first and last days of each month with the number of the appropriate day (ie 23 for the 23 June)
*/
calendar_tds.forEach((month, index) => {

  let counter = 1; // used to populate table cells with appropriate day numbers (ie 23 for the 23 June)
  let starting_index = academic_year[index]["first_day_integer"];
  let stopping_index = academic_year[index]["days_in_month"] + academic_year[index]["first_day_integer"];

  for (let i = 0; i < month.length; i++) {

    let current_day_cell = month[i];

    // any table cells outside either the start of end of month
    if (i < starting_index || i >= stopping_index) {
       current_day_cell.classList.add("calendar__type--empty");
       current_day_cell.classList.remove("calendar__type--weekend");
    } else {

      current_day_cell.innerHTML = counter;
      counter++

      if (is_bank_holiday(current_loop_date)) {
        current_day_cell.classList.add("calendar__type--bank-holiday");
      } else {
         // not weekend
        if (!current_day_cell.classList.contains("calendar__type--weekend")) {
          // school hols
          if (is_school_holiday(current_loop_date, school_hols)) {
            current_day_cell.classList.add("calendar__type--school-holiday");
          }
        }
      }

      let newDate = current_loop_date.setDate(current_loop_date.getDate() + 1);
      current_loop_date = new Date(newDate);
    }
  }
});
