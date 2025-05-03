import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "./style.css";

const calendarContainer = document.createElement("div");
calendarContainer.id = "calendar";
document.body.appendChild(calendarContainer);

flatpickr(calendarContainer, {
  inline: true,
  dateFormat: "d-m-Y",
  weekNumbers: true,
  onChange: function (selectedDates, dateStr, instance) {
    window.callAmplenotePlugin("open_jot", selectedDates);
  },
  onDayCreate: async function (dObj, dStr, fp, dayElem) {
    const jotExists = await window.callAmplenotePlugin(
      "fetch_jot",
      dayElem.dateObj,
    );
    if (jotExists) {
      dayElem.innerHTML += `<div class="indicator"></div>`;
    }
    /*
    dayElem.addEventListener("mouseover", (e) => {
      const infoDiv = document.createElement("div");
      infoDiv.classList.add("hover-popup");
      infoDiv.textContent = "Hello World";

      const dayRect = dayElem.getBoundingClientRect();
      const calendarRect = fp.calendarContainer.getBoundingClientRect();
      infoDiv.style.position = "absolute";
      infoDiv.style.left = `${dayRect.left - calendarRect.left}px`;
      infoDiv.style.top = `${dayRect.bottom - calendarRect.top + 5}px`;
      infoDiv.style.zIndex = "10";
      fp.calendarContainer.appendChild(infoDiv);
      dayElem.dataset.infoDivId = infoDiv.id = `info-${Date.now()}`;
    });

    dayElem.addEventListener("mouseout", () => {
      const infoDivId = dayElem.dataset.infoDivId;
      if (infoDivId) {
        const infoDiv = document.getElementById(infoDivId);
        if (infoDiv) {
          infoDiv.remove();
          delete dayElem.dataset.infoDivId;
        }
      }
    });
    */
  },
  onMonthChange: async function (selectedDates, dateStr, instance) {
    on_weekClick(instance);
  },
  onReady: function (selectedDates, dateStr, instance) {
    on_weekClick(instance);
  },
});

function on_weekClick(fpInstance) {
  const weekElements = document.querySelectorAll(
    "div.flatpickr-weeks > span.flatpickr-day",
  );
  weekElements.forEach(async (el) => {
    let jotExists = await window.callAmplenotePlugin(
      "fetch_week_jot",
      el.textContent,
      fpInstance.currentYear,
    );

    if (jotExists) {
      el.innerHTML += `<div class="indicator"></div>`;
    }

    el.addEventListener("click", () => {
      window.callAmplenotePlugin(
        "open_week_jot",
        parseInt(el.textContent),
        fpInstance.currentYear,
      );
    });
  });
}
