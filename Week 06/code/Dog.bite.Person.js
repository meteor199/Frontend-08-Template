/**
 * 使用 面向对象 描述 狗咬人
 */

/**
 * 这是错误的
 */
class Dog {
  constructor(name) {
    this.name = name;
  }
  bite(p) {
    console.log(`dog ${this.name} bite person ${p.name}`);
  }
}

class Person {
  constructor(name) {
    this.name = name;
  }
}

// const dog = new Dog("白狗");
// const person = new Person("张三");
// dog.bite(person);

/**
 * 正确的，应该是人收到伤害
 */

class Human {
  constructor(name) {
    this.name = name;
  }
  hurt(damage) {
    console.log(`人 ${this.name} 收到 ${damage.name}伤害`);
  }
}

class Dog {
  constructor(name) {
    this.name = name;
  }
}

const dog = new Dog("白狗");
const person = new Human("张三");
person.hurt(dog);
