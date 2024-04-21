import { useState, useEffect } from "react";
import CalendarHeader from "./components/calendar/CalendarHeader";
import { ref, get, set } from "firebase/database";
import { db } from "./firebaseConfig";
import { getCalendarDates } from "./libs/calendarDates";
import { hideModal, showModal } from "./libs/modal";

function App() {
  const [modalType, setModalType] = useState<"update" | "create">();
  const [eventId, setEventId] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const query = ref(db, "user_testing");
      try {
        const snapshot = await get(query);
        if (snapshot.exists()) {
          if (snapshot.val().events != undefined) {
            setData(snapshot.val().events);
          }
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear: number = new Date().getFullYear();
  const currentMonth: number = new Date().getMonth();
  const days = getCalendarDates(currentYear, currentMonth);

  // state
  const [nameValue, setNameValue] = useState<string>("");
  const [emailValue, setEmailValue] = useState<string>("");
  const [dateValue, setDateValue] = useState<string>("");
  const [timeValue, setTimeValue] = useState<string>("");
  const [data, setData] = useState<any>([]);

  const resetValue = () => {
    setNameValue("");
    setEmailValue("");
    setDateValue("");
    setTimeValue("");
    setEventId("");
  };

  const onSubmitForm = (e: any) => {
    e.preventDefault();

    if (modalType == "create") {
      // Mengecek apakah data dengan tanggal yang dipilih sudah ada
      const isDataExist = data.some((item: any) => item.date === dateValue);

      // Menambah events pada tanggal yang dipilih ketika tanggal belum tersedia dan ketika tersedia
      if (!isDataExist) {
        data.push({
          date: dateValue,
          events: [
            {
              id: dateValue + (Math.random() * 1000).toFixed(),
              name: nameValue,
              email: emailValue,
              time: timeValue,
            },
          ],
        });
      } else {
        const thisDate: any = data.find((data: any) => data.date == dateValue);
        if (thisDate.events.length != 3) {
          thisDate.events.push({
            id: dateValue + (Math.random() * 1000).toFixed(),
            name: nameValue,
            email: emailValue,
            time: timeValue,
          });
          setData(data);
        } else {
          console.log("event sudah tidak bisa ditambah");
        }
      }

      set(ref(db, "user_testing"), { name: "user_testing", events: data });
    } else {
      const thisDate = data.find((data: any) => data.date == dateValue);
      const thisEvent = thisDate.events.find((event: any) => event.id == eventId);

      thisEvent.name = nameValue;
      thisEvent.email = emailValue;
      thisEvent.time = timeValue;
      set(ref(db, "user_testing"), { name: "user_testing", events: data });
    }

    hideModal("update_or_create_modal");
    resetValue();
  };

  // Delete event function
  const deleteEvent = () => {
    const updatedEvents = data.map((data: any) => {
      if (data.date === dateValue) {
        const indexToRemove = data.events.findIndex((event: any) => event.id === eventId);
        if (indexToRemove !== -1) {
          data.events.splice(indexToRemove, 1);
        }
      }
      return data;
    });

    const thisDate: any = updatedEvents.find((data: any) => data.date == dateValue);

    if (thisDate.events.length == 0) {
      const currentData = data.filter((data: any) => data.date != thisDate.date);

      setData(currentData);
      set(ref(db, "user_testing"), { name: "user_testing", events: currentData });
    } else {
      setData(updatedEvents);
      set(ref(db, "user_testing"), { name: "user_testing", events: updatedEvents });
    }

    hideModal("update_or_create_modal");
    resetValue();
  };

  return (
    <>
      <main className="px-20 pt-12 pb-24">
        <section
          id="calendar-container"
          className="row"
        >
          <table className="w-full border-collapse">
            <CalendarHeader />
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
                                onClick={() => {
                                  setModalType("create");
                                  showModal("update_or_create_modal");
                                  setDateValue(`${monthName[day.getMonth()].toLowerCase()}_${day.getDate()}`);
                                }}
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
                            {(() => {
                              const dateWithEvents: any = data.find((data: any) => data.date == `${monthName[day.getMonth()].toLowerCase()}_${day.getDate()}`);

                              let event;

                              if (dateWithEvents) {
                                event = dateWithEvents.events.map((event: any, index: number) => (
                                  <div
                                    key={index}
                                    className="calendar-events"
                                  >
                                    <div
                                      className={`w-full rounded-lg px-3 py-1 mb-1 font-semibold text-neutral line-clamp-1 ${(index == 0 && "bg-primary") || (index == 1 && "bg-warning") || "bg-accent"}`}
                                      onClick={() => {
                                        setEventId(event.id);
                                        setNameValue(event.name);
                                        setEmailValue(event.email);
                                        setTimeValue(event.time);
                                        setDateValue(`${monthName[day.getMonth()].toLowerCase()}_${day.getDate()}`);
                                        setModalType("update");
                                        showModal("update_or_create_modal");
                                      }}
                                    >
                                      {event.name}
                                    </div>
                                  </div>
                                ));
                              }

                              return event;
                            })()}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </main>

      {/* begin:: Update or Create Modal */}
      <dialog
        id="update_or_create_modal"
        className="modal"
      >
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Add Event</h3>
          <form
            action=""
            onSubmit={onSubmitForm}
            className="py-4"
          >
            <input
              type="text"
              placeholder="Name"
              className="input input-bordered w-full mb-3"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Invitees Email"
              className="input input-bordered w-full mb-3"
              value={emailValue}
              onChange={(e) => setEmailValue(e.target.value)}
              required
            />
            <input
              type="time"
              // type="datetime-local"
              placeholder="Time"
              className="input input-bordered w-full mb-3"
              value={timeValue}
              onChange={(e) => setTimeValue(e.target.value)}
              required
            />
            <div className="modal-action flex justify-between items-center">
              {modalType == "update" && (
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={deleteEvent}
                >
                  Hapus
                </button>
              )}
              <div className="flex justify-end w-full">
                <button
                  type="button"
                  className="btn me-1"
                  onClick={() => {
                    hideModal("update_or_create_modal");
                    resetValue();
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}

export default App;
