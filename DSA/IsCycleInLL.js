/**
 * PROBLEM EXPLANATION:
 * Given head, the head of a linked list, determine if the linked list has a cycle in it.
 */

class ListNode {
    constructor(value) {
      this.value = value;
      this.next = null;
    }
}
  

let n1 = new ListNode(1);
let n2 = new ListNode(2);
let n3 = new ListNode(3);

n1.next = n2;
n2.next = n3;


let c1 = new ListNode(1);
let c2 = new ListNode(2);
let c3 = new ListNode(3);

c1.next = c2;
c2.next = c3;
c3.next = c2;

function hasCycle(head) {
    let slow = head;
    let fast = head;
  
    while (fast !== null && fast.next !== null) {
      slow = slow.next;
      fast = fast.next.next;
  
      if (slow === fast) {
        return true;
      }
    }
  
    return false;
  }
  console.log(hasCycle(n1));
  console.log(hasCycle(c1));
    