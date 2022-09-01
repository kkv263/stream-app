<script lang="ts">
  let time:string;

  const getTime = () => {
    const today = new Date();
    const hours = today.getHours();
    let suffix = hours >= 12 ? "PM":"AM";
    const hoursString = ((hours + 11) % 12 + 1);
    // const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    return hoursString + ":" + today.getMinutes() + ":" + today.getSeconds() + suffix;
  }

  time = getTime();
</script>

<div>{time}</div>

<style lang="scss">

</style>