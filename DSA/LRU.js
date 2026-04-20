/**
 * PROBLEM EXPLANATION:
 * Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.
 */

class Node {
    constructor(key, value) {
      this.key = key;
      this.value = value;
      this.prev = null;
      this.next = null;
    }
  }

  
  class LRUCache {
    constructor(capacity) {
      this.capacity = capacity;
      this.cache = new Map(); // key -> node
  
      // Dummy head & tail
      this.head = new Node(0, 0);
      this.tail = new Node(0, 0);
      this.head.next = this.tail;
      this.tail.prev = this.head;
    }
  
    // ----- Helpers -----
    _remove(node) {
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }
  
    _addToFront(node) {
      node.next = this.head.next;
      node.prev = this.head;
      this.head.next.prev = node;
      this.head.next = node;
    }
  
    // ----- API -----
    get(key) {
      if (!this.cache.has(key)) return -1;
  
      const node = this.cache.get(key);
      this._remove(node);
      this._addToFront(node);
      return node.value;
    }
  
    put(key, value) {
      if (this.cache.has(key)) {
        this._remove(this.cache.get(key));
      }
  
      const node = new Node(key, value);
      this.cache.set(key, node);
      this._addToFront(node);
  
      if (this.cache.size > this.capacity) {
        const lru = this.tail.prev;
        this._remove(lru);
        this.cache.delete(lru.key);
      }
    }
  }

  
const lru = new LRUCache(2);

lru.put(1, 1);
lru.put(2, 2);
console.log(lru.get(1)); // 1

lru.put(3, 3); // evicts key 2
console.log(lru.get(2)); // -1

lru.put(4, 4); // evicts key 1
console.log(lru.get(1)); // -1
console.log(lru.get(3)); // 3
console.log(lru.get(4)); // 4
