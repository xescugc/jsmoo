[![Build Status][travis-image]][travis-url]
```
                         _                           
                        | |                          
                        | |___ _ __ ___   ___   ___  
                    _   | / __| '_ ` _ \ / _ \ / _ \ 
                   | |__| \__ \ | | | | | (_) | (_) |
                    \____/|___/_| |_| |_|\___/ \___/ 
                                                     
                                                     

```
  * [Jsmoo](#jsmoo)
  * [Installation](#installation)
  * [Simple Example](#simpleexample)
  * [API](#api)
    * [beforeInitialize](#beforeinitialize)
    * [afterInitialize](#afterinitialize)
    * [before](#before)
    * [after](#after)
    * [has](#has)
      * [is](#is)
      * [isa](#isa)
      * [default](#default)
      * [required](#required)
      * [lazy](#lazy)
      * [predicate](#predicate)
      * [clearer](#clearer)
      * [builder](#builder)
      * [trigger](#trigger)
      * [coerce](#coerce)
    * [does](#does)
    * [getAttributes](#getattributes)
  * [Role](#role)

# Jsmoo

Jsmoo (JavaScript Minimalist Object Orientation), it's a library that allows you to define consistent Classes and Roles with a simple API. It's inpired for the Perl library called [Moo][moo] and [Moose][moose]. It provides type validation for attributes (`isa`), presence validation (`required`), defaults (`default`), role composition (`does` and `Role`) and much more.

# Installation

With npm:

``` js
  $> npm install --save jsmoo
```

<a name='simpleexample'>

# Simple Example

Without Jsmoo:

``` js
  class Client extends Jsmoo {
    constructor({name, surname, age = 18}) {
      if (!name) throw new Error('... some error ...');
      if (typeof name !== 'string') throw new Error('... some error ...');
      if (typeof age !== 'number') throw new Error('... some error ...');
      if (typeof surname !== 'string') throw new Error('... some error ...');

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

The example without Jsmoo it's not the same of the one with Jsmoo, because to write the access validation `is` is so much code :) but you get the point, no?

# API

The module itself exports more than one module:

``` js
  import Jsmoo, { Role, before, after } from 'jsmoo';
```

The way the Classes are initialized is with a plain Object, where the keys are the attributes defined on the `has`.

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

## before

The `before` function is called before the specified function, the result of it is totally ignored, but you can throw an error to stop it if you need too.

``` js
  import Jsmoo, { before } from 'jsmoo';

  class Client extends from Jsmoo {
    save() {
      // Save the client (fake)
      db.insert(this);
    }
  }

  Client.has({
    name:     { is: 'rw', isa: 'string', predicate: 1},
    surname:  { is: 'rw', isa: 'string', predicate: 1},
  });

  before(Client.prototype, 'save', function() {
    if (this.hasSurname() && !this.hasName()) {
      throw new TypeError('Need name if surname');
    }
  });

  const client = new Client({ surname: 'Grillo' });

  client.save();
```

## after

The `after` function is called after the specified function, the result of it is totally ignored.

``` js
  import Jsmoo, { after } from 'jsmoo';

  class Client extends from Jsmoo {
    save() {
      // Save the client (fake)
      db.insert(this);
    }
  }

  Client.has({
    name:     { is: 'rw', isa: 'string' },
  });

  after(Client.prototype, 'save', function() {
    Mailer.send(this)
  });

  const client = new Client({ surname: 'Grillo' });

  client.save();
```

## has

Has provides the core functionallity of this module, define the attributes of the Class as easy as possible with a cler way. This method is a `static` method of the Class that has extended from `Jsmoo`.

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

  * `string` or `String`
  * `number` or `Number`
  * `array` or `Array`
  * `boolean` or `Boolean`
  * `object` or `Object`
  * `Maybe[type]` validates the type but it wont throw error if it's `undefined` or `null`
  * Your types
  * Custom validations

Each of this types is defined as string on the `isa` except for the 'Custom validations' which are functions that validates the type value, to declare a value as invalid you have to throw an error.

__Example:__

``` js
  class Client extends Jsmoo { }

  function isEven(value) {
    if (value % 2 !== 0) throw new Error('Not even value')
  }

  Client.has({
    name:     { is: 'rw', isa: 'string' },
    age:      { is: 'rw', isa: 'number' },
    address:  { is: 'rw', isa: 'object' },
    valid:    { is: 'rw', isa: 'boolean'},
    city:     { is: 'rw', isa: 'City' }, // Your types
    even:     { is: 'rw', isa: isEven }, // Your custom validation
    number:   { is: 'rw', isa: 'Maybe[number]' }, // Can be undefined or null
  });

  const city = new City();

  const client = new Client({
    name: 'Pepito',
    age: 45,
    address: {},
    valid: true,
    city: city,
    even: 2,
  });
```

### default

It defines a default value of an attribute if no one is given in the initialization, it can be a simple value or a function, the function has the `this` context of the Class but if you try to access some attribute that it's also default, you may, or may not, get the value you expect, if you want this behavior you shoud define the attributte you want to access as `lazy`.

__Example:__

``` js
  class Client extends Jsmoo {}

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

It describes the attribute as `required` as a boolean value, which means that it must be (if true) one of the parameters on initialization time, if it's not present it will fail loudly.

__Example:__

``` js
  class Client extends Jsmoo {}

  Client.has({
    name: { is: 'rw', required: true }
  })
```

### lazy

The attributes defined as `lazy` will be instanciated only when the attribute is called.

__Example:__

```js
  class Client extends Jsmoo {}

  Clint.has({
    name: { is: 'rw', lazy: true }
  });
```

### predicate

Created a function (`has${attributeName}` if it start with _ then `_has${attributeName}`) to validate if the value is defined, wich means the values is not `undefined` or `null`

__Example:__

```js
  class Client extends Jsmoo {}

  Clint.has({
    name: { is: 'rw', predicate: true }
  });

  let obj = new Client({ name: 'value' });
  obj.hasName()
  // => true
  obj.name = undefined;
  obj.hasName()
  // => false
```
### clearer

Created a function (`clear${attributeName}` if it start with _ then `_clear${attributeName}`) to clear the value, which means removing the attribute from the internal store.

__Example:__

```js
  class Client extends Jsmoo {}

  Clint.has({
    name: { is: 'rw', clearer: true }
  });

  let obj = new Client({ name: 'value' });
  obj.name
  // => value
  obj.clearName();
  obj.name
  // => undefined
```

### builder

Created a defines a function to build the attribute if not initialized, if it has a Boolean value it will call the function `build${attributeName}` (if it start with _ then `_build${attributeName}`) but you can override this by passing a string with the name of the builder function that you want, this function would have the `this` context of the class.

__Example:__

```js
  class Client extends Jsmoo {}

  Clint.has({
    name: { is: 'rw', builder: true },
    age:  { is: 'rw', builder: 'buildAgeForUser' },
  });

  Client.prototype.buildAgeForUser = function() {}
  Client.prototype.buildName = function() {}

```

### trigger

It creates a handle that will trigger after the attribute is setted. This includes the constructor but not `default` ond `builder`. This handle will recieve the `oldValue` and the `newValue`. It can be defined with a boolean value, in which case would call a function with the name of the attribute like this `trigger${attributeName}` (if is starts with _ then `_trigger${attributeName}`. Or it can be defined with a funciton.

__Example:__

```js
  class Client extends Jsmoo {}

  Client.has({
    name:     { is: 'rw', trigger: 1 },
    age:      { is: 'rw', trigger: triggerForAge },
    surname:  { is: 'rw', trigger: trigger(newValue, oldValue) {} },
  });

  Client.prototype.triggerName = function (newValue, oldValue) { }
  function triggerForAge (newValue, oldValue) { }
```

### coerce

It takes a function and coerce the attribute

__Example:__

```js
  class Client extends Jsmoo {}

  function stringToNumber(value) {
      if (typeof value === 'string') {
        return value * 1;
      }
      return value
  }

  Client.has({
    age:    { is: 'rw', isa: 'number', coerce: stringToNumber },
  });

  const client = new Client({ age: '25' });
  client.age
  # 18
  typeof client.age
  # number

```

## does

It's the way to acomplish composition, there are some rules for Role composition:

  * Only `Roles` can be composed.
  * Roles can `override` existing attributes with the `+` sign.
  * Classes can `override` existing attributes with the sign `+` sign.
  * If one of the _overrided_ attributes is not declated (with has) before the declaration of the _override_ it will fail loudly.
  * If a function is defined in the main Class, the Role will not override it.

The instance and class functions will be composed to the main Class and also the attributes defined with `has`.

__Example:__

``` js
  //------- address_role.js
  import Jsmoo, { Role } from 'jsmoo';

  class AddressRole extends Role {
    static staticFunction() {
      return 'static'
    }
    instanceFunction() {
      return this.name
    }
  }

  AddressRole.has({
    address: { is: 'rw', default: 'C/ To Pepi' }
  })

  export default AddressRole;

  //------- person.js
  import Jsmoo, { Role } from 'jsmoo';
  import AddressRole from './address_role';

  class Person extends Jsmoo {}

  Person.does(AddressRole)

  Person.has({
    name:       { is: 'rw' },
    '+address': { default: 'C/ Pepi To' },
  })

  Person.staticFunction()
  // => 'static'

  let person = new Person({ name: 'Pepito' })

  person.instanceFunction()
  // => 'Pepito'

  person.address
  // => 'C/ Pepi To'
```

## getAttributes

This function is present in all the Classes extending of Jsmoo as a instance function, it returns all the attributes setted of the Class:

__Example;__

``` js

  class Client extends Jsmoo {}

  Client.has({
    name: { is: 'rw' },
    age:  { is: 'rw', default: 18 },
  });

  const client = new Client({
    name: 'Pepito'
  });

  console.log(client.getAttribute());

  // => { name: 'Pepito', age:  18 }

```

# Role

Roles are the way to achive composition, they are similar to the Jsmoo class but with some differences:

  * They are the only ones that can be composed with `does`.
  * Roles can not be initialized.

Roles also have the `has` static function to define attributes, wich then will be extended to the main Jsmoo Class.

[moo]: https://metacpan.org/pod/Moo
[moose]: https://metacpan.org/pod/Moose
[travis-image]: https://travis-ci.org/XescuGC/jsmoo.svg?branch=master
[travis-url]: https://travis-ci.org/XescuGC/jsmoo
