(async () => {

  const user = {
    login: "username" + Math.random(),
    password: "password",
  };

  // const result = await fetch("http://localhost:3000", {
  //   method: "POST",
  //   body: JSON.stringify(user),
  //   headers: {
  //     "content-type": "application/json",
  //   }
  // });
  //
  const results = await Promise.allSettled([
    fetch("http://localhost:3000", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "content-type": "application/json",
      }
    }),
    fetch("http://localhost:3000", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "content-type": "application/json",
      }
    }),
  ]);

  for (const res of results) {
    console.log(`Response status: ${res.value.status}`);
    if (res.value.status >= 400) {
      const body = await res.value.text();
      console.log(`Response body: "${body}"`);
    }
  }

})().catch(console.error);
