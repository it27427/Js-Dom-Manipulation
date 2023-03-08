// CALENDAR INITIALIZED
const calendar = document.querySelector('#calendar');
const monthEl = document.querySelector('#month');
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const days = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ];
const STORYBLOK_URL =
  'https://api-us.storyblok.com/v2/cdn/stories?starts_with=events&token=<PUBLIC_API_KEY>';
let events;
const today = new Date();

// GET CURRENT MONTH, YEAR
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const loadEvents = async () => {
  const res = await fetch(STORYBLOK_URL);
  const { stories } = await res.json();
  events = stories.reduce((accumulator, event) => {
    const eventTime = new Date(event.content.time);
    const eventDate = new Date(eventTime.toDateString());
    accumulator[eventDate] = event.content;
    return accumulator;
  }, {});
}

// DRAW A BLANK-CALENDAR
const drawBlankCalendar = () => {
  for(let i = 0; i < 35; i++) {
    const day = document.createElement('div');
    day.classList.add('day');

    const dayText = document.createElement('p');
    dayText.classList.add('day-text');
    dayText.innerText = days[i % 7];

    const dayNumber = document.createElement('p');
    dayNumber.classList.add('day-number');
    
    const eventName = document.createElement('small');
    eventName.classList.add('event-name');

    day.appendChild(dayText);
    day.appendChild(dayNumber);
    day.appendChild(eventName);

    calendar.appendChild(day);
  }
};

const updateCalendar = (month, year, events) => {
  const dayElements = document.querySelectorAll('.day');

  const currentDate = new Date();
  currentDate.setMonth(month);
  currentDate.setYear(year);

  const firstDayOfWeek = currentDate.getDay();
  const monthName = months[month];
  const monthWithYear = `${year} - ${monthName}`;
  monthEl.innerText = monthWithYear;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let dayCounter = 1;
  for(let i = 0; i < dayElements.length; i++) {
    const day = dayElements[i];

    const dayNumber = day.querySelector('.day-number');
    if(i >= firstDayOfWeek && dayCounter <= daysInMonth) {
      const thisDate = new Date(year, month,dayCounter);
      const eventTime = day.querySelector('.event-name');

      if(events[thisDate]) {
        const event = events[thisDate];
        eventName.innerText = `${event.title}`;
      } else {
        eventName.innerText = ``;
      }

      dayNumber.innerText = dayCounter;
      dayCounter++;
    } else {
      dayNumber.innerText = '';
    }
  }
}

const previousMonth = () => {
  if(currentMonth === 0) {
    currentMonth = 12;
    currentYear--;
  }
  updateCalendar(--currentMonth, currentYear);
}

const nextMonth = () => {
  if(currentMonth === 11) {
    currentMonth = -1;
    currentYear++;
  }
  updateCalendar(++currentMonth, currentYear);
}

const load = async () => {
  drawBlankCalendar();
  updateCalendar(currentMonth, currentYear);
  await loadEvents();
}

load();