import { useState } from "react";

function App() {
  const currentYear: number = new Date().getFullYear();
  const currentMonth: number = new Date().getMonth();
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // const previousMonth: number = new Date().getMonth() + 1;

  const date = new Date(currentYear, currentMonth, 1);

  let days: Array<Date> = [];
  while (date.getMonth() === currentMonth) {
    const currentDay = new Date(date);
    days.push(currentDay);
    date.setDate(date.getDate() + 1);
  }

  const firstDay = days[0].getDay();
  const lastDay = days[days.length - 1].getDay();

  if (firstDay != 1 && firstDay < 1) {
    for (let i = firstDay; i < 6; i++) {
      days.unshift(new Date(currentYear, currentMonth, -i));
    }
  } else if (firstDay != 1 && firstDay > 1) {
    for (let i = 0; i < firstDay - 1; i++) {
      days.unshift(new Date(currentYear, currentMonth, -i));
    }
  }

  if (lastDay != 0) {
    for (let i = 1; i <= 7 - lastDay; i++) {
      days.push(new Date(currentYear, currentMonth + 1, i));
    }
  }

  return (
    <>
      <main className="px-20 pt-12 pb-24">
        <section
          id="calendar-container"
          className="row"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="mb-4">
                <th className="w-[13.3%] p-2 pb-4 overflow-hidden">Monday</th>
                <th className="w-[13.3%] p-2 pb-4 overflow-hidden">Tuesday</th>
                <th className="w-[13.3%] p-2 pb-4 overflow-hidden">Wednesday</th>
                <th className="w-[13.3%] p-2 pb-4 overflow-hidden">Thursday</th>
                <th className="w-[13.3%] p-2 pb-4 overflow-hidden">Friday</th>
                <th className="w-[13.3%] p-2 pb-4 overflow-hidden">Saturday</th>
                <th className="w-[13.3%] p-2 pb-4 overflow-hidden">Sunday</th>
              </tr>
            </thead>

            {/* <tbody>
              <tr>
                {days.slice(0, 7).map((day: any, index: any) => (
                  <td
                    key={index}
                    className="p-0"
                  >
                    <div className="min-h-32">{day.getDate()}</div>
                  </td>
                ))}
              </tr>
              <tr>
                {days.slice(7, 14).map((day: any, index: any) => (
                  <td
                    key={index}
                    className="p-0"
                  >
                    <div className="min-h-32">{day.getDate()}</div>
                  </td>
                ))}
              </tr>
            </tbody> */}

            <tbody>
              {Array(Math.ceil(days.length / 7))
                .fill(null)
                .map((_, rowIndex) => (
                  <tr key={rowIndex}>
                    {days.slice(rowIndex * 7, (rowIndex + 1) * 7).map((day: Date, index: number) => {
                      const currentDate = new Date();
                      let isDisabled = day.getMonth() == currentMonth && day.getDate() < currentDate.getDate() ? true : false;

                      // set if is date is the current month
                      let isMonth = day.getMonth() == currentMonth ? true : false;

                      return (
                        <td
                          key={index}
                          className="p-0 border border-neutral group"
                        >
                          <div className="min-h-36 p-2">
                            <div className="flex justify-between mb-3">
                              <button
                                type="button"
                                className={`btn btn-sm btn-neutral transition-all ease-in duration-100 opacity-0 group-hover:opacity-100 ${isDisabled && "btn-disabled"}`}
                                tabIndex={-1}
                                role="button"
                                aria-disabled="true"
                                onClick={() => document?.getElementById("update_or_create_modal")?.showModal()}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 448 512"
                                  className=" w-4 h-4 fill-white"
                                >
                                  <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
                                </svg>
                              </button>
                              <div className={`${!isMonth && "opacity-50"}`}>{!isMonth && day.getDate() == 1 ? monthName[day.getMonth()] + " " + day.getDate() : day.getDate()}</div>
                            </div>
                            {index == 3 && rowIndex == 2 && (
                              <div className="calendar-events">
                                <div className="w-full rounded-lg px-3 py-1 mb-1 font-semibold text-neutral line-clamp-1 bg-primary">Events 1 testing test</div>
                                <div className="w-full rounded-lg px-3 py-1 mb-1 font-semibold text-neutral line-clamp-1 bg-secondary">Events 3</div>
                                <div className="w-full rounded-lg px-3 py-1 mb-1 font-semibold text-neutral line-clamp-1 bg-accent">Events 2</div>
                              </div>
                            )}
                            {day.getDate() == new Date().getDate() && <div className="w-full rounded-lg px-3 py-1 mb-1 font-semibold text-neutral line-clamp-1 bg-amber-300">Today</div>}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              <dialog
                id="update_or_create_modal"
                className="modal"
              >
                <div className="modal-box">
                  <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                  </form>
                  <h3 className="font-bold text-lg">Add Event</h3>
                  <form action="" className="py-4">
                    <input
                      type="text"
                      placeholder="Name"
                      className="input input-bordered w-full mb-3"
                    />
                    <input
                      type="email"
                      placeholder="Invitees Email"
                      className="input input-bordered w-full mb-3"
                    />
                    <input
                      type="datetime-local"
                      placeholder="Invitees Email"
                      className="input input-bordered w-full mb-3"
                    />
                  </form>
                  <div className="modal-action">
                    <form method="dialog">
                      <button className="btn me-2">Cancel</button>
                      <button className="btn btn-primary">Save</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </tbody>
          </table>

          {/* <div className="container flex flex-wrap">
            {days.map((day: any, index: any) => (
              <div
                key={index}
                className="p-4 w-[14.2%] border border-slate-500"
              >
                <div className="">hari : {dayName[day.getDay()]}</div>
                <div className="">hari : {day.getDay()}</div>
                <div className="">tanggal : {day.getDate()}</div>
                <div className="">bulan : {monthName[day.getMonth()]}</div>
              </div>
            ))}
          </div> */}
        </section>
      </main>
    </>
  );
}

export default App;
