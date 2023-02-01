<script>
    export let disabled;
</script>


<button
type="submit"
class="
    flex w-full justify-center rounded-md border-transparent
    bg-purple-800 hover:bg-purple-700
    px-4 text-lg font-bold
    focus:outline-none focus:ring-2 
    focus:ring-purple-500 focus:ring-offset-2
    border
    border-purple-900
    bg-dark-blue-900 dark:bg-purple-1000
    {!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}
    {!disabled ? 'hover:bg-dark-blue-800' : ''}
    {!disabled ? 'dark:hover:bg-purple-700' : ''}
    w-full
    lg:px-20
    py-3 text-white tracking-wider rounded-lg
    uppercase
">
<slot></slot>
</button>
