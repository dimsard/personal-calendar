// useEffect(() => {
//   const fetchData = async () => {
//     const query = ref(db, "user_1");
//     try {
//       const snapshot = await get(query);
//       if (snapshot.exists()) {
//         console.log(snapshot.val());
//       } else {
//         console.log("No data available");
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   fetchData();
// }, []);

const CalendarHeader = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <thead>
      <tr className="mb-4">
        {days.map((day, index) => (
          <th
            key={index}
            className="w-[13.3%] p-2 pb-4 overflow-hidden"
          >
            {day}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default CalendarHeader;
