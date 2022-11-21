"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LinkedList = exports.LinkedList = function () {
  function LinkedList() {
    _classCallCheck(this, LinkedList);

    this.length = 0;
    this.first = null;
    this.last = null;
  }

  _createClass(LinkedList, [{
    key: "each",
    value: function each(fn) {
      var node = this.first;
      for (var i = 0; i < this.length; i++) {
        fn(node, i);
        node = node.next;
      }
    }
  }, {
    key: "at",
    value: function at(i) {
      if (!(i >= 0 && i < this.length)) {
        return null;
      }
      var node = this.first;
      while (i--) {
        node = node.next;
      }
      return node;
    }
  }, {
    key: "randomNode",
    value: function randomNode() {
      var n = Math.floor(Math.random() * this.length);
      return this.at(n);
    }
  }, {
    key: "toArray",
    value: function toArray() {
      var arr = [];
      var node = this.first;
      var n = this.length;
      while (n--) {
        arr.push(node.data || node);
        node = node.next;
      }
      return arr;
    }
  }]);

  return LinkedList;
}();

function Node(data) {
  this.prev = null;
  this.next = null;
  this.data = data;
}

LinkedList.Node = Node;

var Circular = function () {
  function Circular() {
    _classCallCheck(this, Circular);
  }

  _createClass(Circular, [{
    key: "append",
    value: function append(node) {
      if (this.first === null) {
        node.prev = node;
        node.next = node;
        this.first = node;
        this.last = node;
      } else {
        node.prev = this.last;
        node.next = this.first;
        this.first.prev = node;
        this.last.next = node;
        this.last = node;
      }
      this.length++;
    }
  }, {
    key: "prepend",
    value: function prepend(node) {
      if (this.first === null) {
        this.append(node);
        return;
      }

      node.prev = this.last;
      node.next = this.first;
      this.first.prev = node;
      this.last.next = node;
      this.first = node;
      this.length++;
    }
  }, {
    key: "insertAfter",
    value: function insertAfter(node, newNode) {
      newNode.prev = node;
      newNode.next = node.next;
      node.next.prev = newNode;
      node.next = newNode;
      if (newNode.prev === this.last) {
        this.last = newNode;
      }
      this.length++;
    }
  }, {
    key: "insertBefore",
    value: function insertBefore(node, newNode) {
      newNode.prev = node.prev;
      newNode.next = node;
      node.prev.next = newNode;
      node.prev = newNode;
      if (newNode.next === this.first) {
        this.first = newNode;
      }
      this.length++;
    }
  }, {
    key: "remove",
    value: function remove(node) {
      if (this.length > 1) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
        if (node === this.first) {
          this.first = node.next;
        }
        if (node === this.last) {
          this.last = node.prev;
        }
      } else {
        this.first = null;
        this.last = null;
      }
      node.prev = null;
      node.next = null;
      this.length--;
    }
  }, {
    key: "withData",
    value: function withData(data) {
      var nodeFromStart = this.first;
      var nodeFromEnd = this.last;
      var n = Math.ceil(this.length / 2);
      while (n--) {
        if (nodeFromStart.data === data) {
          return nodeFromStart;
        }
        if (nodeFromEnd.data === data) {
          return nodeFromEnd;
        }
        nodeFromStart = nodeFromStart.next;
        nodeFromEnd = nodeFromEnd.prev;
      }
      return null;
    }
  }], [{
    key: "fromArray",
    value: function fromArray(list, useNodes) {
      var linked = new LinkedList.Circular();
      var n = list.length;
      while (n--) {
        linked.prepend(useNodes ? new LinkedList.Node(list[n]) : list[n]);
      }
      return linked;
    }
  }]);

  return Circular;
}();

LinkedList.Circular = Circular;