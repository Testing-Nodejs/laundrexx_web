export default function DateFilter({ date }) {
  console.log(date)
  let idate = new Date(new Date(date).toISOString().split("T")[0]);
  let dateMDY = `${idate.getDate().toString().padStart(2, "0")}-${(
    idate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${idate.getFullYear()}`;
  return dateMDY;
}
