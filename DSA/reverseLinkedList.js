/**
 * PROBLEM EXPLANATION:
 * Given the `head` of a singly linked list, reverse the list, and return the reversed list.
 */

class ListNode {
    constructor(value) {
      this.value = value;
      this.next = null;
    }
}
  

function reverseLinkedList(head) {
    let prev = null;
    let curr = head;
  
    while (curr !== null) {
      let nextNode = curr.next;
      curr.next = prev;
      prev = curr;
      curr = nextNode;
    }
  
    return prev;
  }

  function printList(head) {
    let current = head;
    let values = [];
    
    while (current !== null) {
      values.push(current.value);
      current = current.next;
    }
  
    console.log(values.join(" -> "));
  }
  // Create nodes
const node1 = new ListNode(1);
const node2 = new ListNode(2);
const node3 = new ListNode(3);

// Link them
node1.next = node2;
node2.next = node3;

// head of the list
let head = node1;

const reversedHead = reverseLinkedList(head);

printList(reversedHead); // Output: 3 -> 2 -> 1
