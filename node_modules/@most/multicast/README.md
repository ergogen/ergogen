# ⚠️ Deprecated ⚠️
 
`@most/multicast` is deprecated.

Support and maintenance will cease when `@most/core` 1.0 is released. Meanwhile, only critical bug fixes will be released. 

Its functionality is currently available in [@most/core](http://mostcore.readthedocs.io/en/latest/api.html#multicast) and will also be available in most 2.0.

# @most/multicast

Efficient source sharing of an underlying stream to multiple observers.

## API

### multicast :: Stream a &rarr; Stream a
Returns a stream equivalent to the original, but which can be shared more efficiently among multiple consumers.

```
stream:             -a-b-c-d->
multicast(stream):  -a-b-c-d->
```

Using multicast allows you to build up a stream of maps, filters, and other transformations, and then share it efficiently with multiple observers.
