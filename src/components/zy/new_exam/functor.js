function Functor(value) {
  this._value = value
}

Functor.of = function(value) {
  return new Functor(value)
}

Functor.prototype.map = function(fn) {
  if (this._value instanceof Array) {
    return Functor.of(this._value.map(fn))
  } else {
    return this
  }
}

Functor.prototype.handle = function(fn) {
  return Functor.of(fn(this._value))
}

Functor.prototype.getData = function() {
  return this._value
}

export default Functor
