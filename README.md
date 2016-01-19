# jsmoo

Jsmoo (JavaScript Minimalist Object Orientation), it's a library that allows you to define consistent Objects and Roles with a simple API. It's is a port from the Perl library called [Moo](https://metacpan.org/pod/Moo). It provides type validation for attributes (`isa`), presence validation (`required`), defaults (`default`), role composition (`with` and `Role`) and much more.

# Install

With npm:

``` js
  $> npm install --save jsmoo
```

# Simple Example

Without Jsmoo:

``` js
  class Client extends Jsmoo {
    constructor({name, surname, age = 18}) {
      this.name = name;
      this.surname = surname;
      this.age = age;
    }

    fullName() {
      return `${this.name} ${this.surname}`;
    }
  }

  const client = new Client({name: 'Pepito', surname: 'Grillo'});
  console.log(client.fullName());
  //  => Pepito Grillo
```

With Jsmoo:

``` js
  import Jsmoo from 'jsmoo';

  class Client extends Jsmoo {
    fullName() {
      return `${this.name} ${this.surname}`;
    }
  }

  Client.has({
    name:     { is: 'rw', isa: 'string', required: true },
    surname:  { is: 'rw', isa: 'string' },
    age:      { is: 'rw', isa: 'number', default: 18 },
  });

  const client = new Client({name: 'Pepito', surname: 'Grillo'});
  console.log(client.fullName());
  //  => 'Pepito Grillo'
```

# API

The module itself exports more than one module:

``` js
  import Jsmoo, { Role } from 'jsmoo';
```

The way the objects are initialized is with a Object, where the keys are the attributes defined on the `has`.

## beforeInitialize

If you define this function on you class, will be called before the initialization arguments are passed to the constructor, here you can redefine this arguements as you want, the `return` from this function will be the ones the constructor will use.

_Example:_

``` js
  class File extends from Jsmoo {
    beforeInitialize(args) {
      args.extension = args.filename.split('.')[-1];
      return args;
    }
  }

  File.has({
    extension:  { is: 'ro', isa: 'string', required: true },
    filename:   { is: 'ro', isa: 'string', required: true },
  });

  const file = new File({filename: 'photo.jpg'});
  console.log(file.extension);
  //  => '.jpg'
```

## afterInitialize

If you define this function on you class, will be called after the initialization without any arguments here you have access to the `this` of the Class.

_Example:_

``` js
  class File extends from Jsmoo {
    afterInitialize() {
      console.log(this.filename);
    }
  }

  File.has({
    filename:   { is: 'ro', isa: 'string', required: true },
  });

  const file = new File({filename: 'photo.jpg'});
  //  => 'photo.jpg'
```

## has

Has provides the core functionallity of this module, define the attributes of the class as easy as possible with a cler way. This method is a `static` method of the Class that has extended from `Jsmoo`.

It expects a Object as parameters and each key of this object will become an attribute of the class. The configuration of the attribute is the value of the attribute key.

__Example:__

``` js
  class File extends from Jsmoo { }

  File.has({
    filename: { is: 'ro' }
  });

```

This is the most basic configuration, the attributes `filename` and his configuration `{ is: 'ro'}`.

### is

It defines the accesability of the attribute, it's the only configuration __REQUIRED__ on the attribute, it can have the following values:

  * `rw`: The attribute can be setted with new values (__Read Write__)
  * `ro`: You can not change the value of this attribute (__Read Only__)

If you try to change a `ro` attribute it will raise an error.

### isa

It defines the type of the attribute, it can have the following values:

  * `string`
  * `number`
  * `array`
  * `boolean`
  * `object`
  * Your types

Each of this types is defined as string on the `isa` except for the `Custom` which is the class of the type:

__Example:__

``` js
  class Client extends Jsmoo { }

  Client.has({
    name:     { is: 'rw', isa: 'string' },
    age:      { is: 'rw', isa: 'number' },
    address:  { is: 'rw', isa: 'object' },
    valid:    { is: 'rw', isa: 'boolean'},
    city:     { is: 'rw', isa: 'City' }, // Your types
  });

  const city = new City();

  const client = new Client({
    name: 'Pepito',
    age: 45,
    address: {},
    valid: true,
    city: city,
  });
```

### default

It defines a default value of an attribute if no one is given in the initialization, it can be a simple value o a function, the function has the `this` context of the Class but if you try to access some attribute that it's also default, you may, or may not, get the value you expect.

__Example:__

```js
  class Client extends Jsmoo { }

  Client.has({
    email:    { is: 'rw' }
    name:     { is: 'rw', default() { return this.email.split('@')[0] },
    valid:    { is: 'rw', isa: 'boolean', default: true },
    created:  { is: 'rw', default() { return new Date }},
  });

  const client = new Client({
    email: 'pepitogrillo@gmail.com'
  });

  client.name     // pepitogrillo
  client.valid    // true
  client.created  // Date

```

### required
## with
# Role
