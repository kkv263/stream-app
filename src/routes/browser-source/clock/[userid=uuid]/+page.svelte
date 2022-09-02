<script lang="ts">
  let time:string;
  export let data;
  let { military_time } = data

  const getTime = () => {
    const today = new Date();
    const hours = today.getHours();
    let suffix = hours >= 12 ? "PM":"AM";
    const hoursString = military_time ? (hours + 11) % 12 + 1 : hours;
    // const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    return `${hoursString}:${today.getMinutes()}:${today.getSeconds().toString().padStart(2, '0')} ${military_time ? suffix : ''}`;
  }

  time = getTime();
  console.log(data);
</script>

<div>{time}</div>

<style lang="scss">

</style>