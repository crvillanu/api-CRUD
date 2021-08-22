var assert = require('assert');
var handler = require('../app').handler;

// Eventos de prueba

let event_POST =
{
  routeKey: "POST /VehicleMilesTraveled",
  body: JSON.stringify(
    {
      "county_fips": 1001,
      "county_name": "Autauga",
      "state_name": "Alabama",
      "date": "2020-05-08",
      "county_vmt": 3550000,
      "baseline_jan_vmt": 3550000,
      "percent_change_from_jan": -16.84,
      "mean7_county_vmt": 2724285.71,
      "mean7_percent_change_from_jan": -23.72,
      "date_at_low": "2020-12-04",
      "mean7_county_vmt_at_low": 1542857.14,
      "percent_change_from_low": 80.83
    })
};

let event_GET_1 =
{
  routeKey: "GET /VehicleMilesTraveled/{county_fips}/{date}",
  pathParameters: {
    "county_fips": 1001,
    "date": "2020-05-08"
  }

}

let event_GET_All =
{
  routeKey: "GET /VehicleMilesTraveled"
}

let event_PUT =
{
  routeKey: "PUT /VehicleMilesTraveled/{county_fips}/{date}",
  pathParameters: {
    "county_fips": 1001,
    "date": "2020-05-08"
  },
  body: JSON.stringify(
    {
      "county_fips": 1001,
      "county_name": "Autauga",
      "state_name": "Alabama",
      "date": "2020-05-08",
      "county_vmt": 3550000,
      "baseline_jan_vmt": 3550000,
      "percent_change_from_jan": -16.84,
      "mean7_county_vmt": 2724285.71,
      "mean7_percent_change_from_jan": -23.72,
      "date_at_low": "2020-12-04",
      "mean7_county_vmt_at_low": 1542857.14,
      "percent_change_from_low": 80.83
    })
};

let event_DELETE =
{
  routeKey: "DELETE /VehicleMilesTraveled/{county_fips}/{date}",
  pathParameters: {
    "county_fips": 1001,
    "date": "2020-05-08"
  }

}

// Pruebas MOCHA

describe('POST', function () {
  describe('Crear un nuevo item', function () {
    it('debe retornar statusCode 201 y body que comienza con Created item...', async function () {
      let r = await handler(event_POST, null);
      assert.equal(r.statusCode, 201);
      assert(r.body.startsWith("\"Created item"));
    });
  });
});

describe('GET', function () {
  describe('Obtener el item almacenado', function () {
    it('debe retornar statusCode 200 y body con 1 item...', async function () {
      let r = await handler(event_GET_1, null);
      //console.log(JSON.stringify(r));
      assert.equal(r.statusCode, 200);
      let r_body = JSON.parse(r.body);
      assert(r_body.Item.county_fips == 1001);
    });
  });
});

describe('GET All', function () {
  describe('Obtener todos los items', function () {
    it('debe retornar statusCode 200 y body con al menos 1 item...', async function () {
      let r = await handler(event_GET_All, null);
      //console.log(JSON.stringify(r));
      assert.equal(r.statusCode, 200);
      let r_body = JSON.parse(r.body);
      assert(r_body.Items.length > 0);
    });
  });
});

describe('PUT', function () {
  describe('Actualizar un item existente', function () {
    it('debe retornar statusCode 200 y body que comienza con Updated item...', async function () {
      let r = await handler(event_PUT, null);
      assert.equal(r.statusCode, 200);
      assert(r.body.startsWith("\"Updated item"));
    });
  });
});

describe('DELETE', function () {
  describe('Eliminar el item almacenado', function () {
    it('debe retornar statusCode 200 y body que comience con Deleted item...', async function () {
      let r = await handler(event_DELETE, null);
      //console.log("DELETE r:"+JSON.stringify(r));
      assert.equal(r.statusCode, 200);
      let r_body = JSON.parse(r.body);
      assert(r.body.startsWith("\"Deleted item"));
    });
  });
});