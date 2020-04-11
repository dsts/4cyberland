<template>
  <pre class="logo">
   _____                ___.                .__                     .___
  /  |  |   ____ ___.__.\_ |__   ___________|  | _____    ____    __| _/
 /   |  |__/ ___|   |  | | __ \_/ __ \_  __ \  | \__  \  /    \  / __ | 
/    ^   /\  \___\___  | | \_\ \  ___/|  | \/  |__/ __ \|   |  \/ /_/ | 
\____   |  \___  | ____| |___  /\___  |__|  |____(____  /___|  /\____ | 
     |__|      \/\/          \/     \/                \/     \/      \/ 
  </pre>
</template>

<style lang="scss">
.logo {
  // These properties have to be explicitly defined because if the inherited
  // values are not the defaults then the logo will not look correctly.
  text-align: left;
  font-family: monospace;
  font-size: 12px;
  word-spacing: 0;

  // This makes the logo act more like an img tag.
  display: inline-block;
}
</style>
