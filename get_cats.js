fetch("http://localhost:8080/api/v1/categories")
  .then((r) => r.json())
  .then((c) =>
    console.log(JSON.stringify(c.map((x) => ({ id: x.id, name: x.name })))),
  );
