/**
 * PROBLEM EXPLANATION:
 * You are given the heads of two sorted linked lists. Merge the two lists in a one sorted list.
 */

class ListNode {
    constructor(value) {
      this.value = value;
      this.next = null;
    }
  }
// List A: 1 → 3 → 5
let a1 = new ListNode(1);
let a2 = new ListNode(3);
let a3 = new ListNode(5);
a1.next = a2;
a2.next = a3;

// List B: 2 → 4 → 6
let b1 = new ListNode(2);
let b2 = new ListNode(4);
let b3 = new ListNode(6);
b1.next = b2;
b2.next = b3;

function mergeTwoSortedLists(l1, l2) {
    let dummy = new ListNode(-1);
    let tail = dummy;
  
    while (l1 !== null && l2 !== null) {
      if (l1.value < l2.value) {
        tail.next = l1;
        l1 = l1.next;
      } else {
        tail.next = l2;
        l2 = l2.next;
      }
      tail = tail.next;
    }
  
    if (l1 !== null) tail.next = l1;
    if (l2 !== null) tail.next = l2;
  
    return dummy.next;
  }
  
const mergedHead = mergeTwoSortedLists(a1, b1);

function printList(head) {
  let current = head;
  let values = [];
  while (current !== null) {
    values.push(current.value);
    current = current.next;
  }
  console.log(values.join(" -> "));
}

printList(mergedHead); // 1 -> 2 -> 3 -> 4 -> 5 -> 6
