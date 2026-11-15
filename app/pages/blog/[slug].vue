<script setup lang="ts">
definePageMeta({ key: (route) => route.path })
const post = useRoutePost()
</script>
<template><PostPage :post="post" /></template>
