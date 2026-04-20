/**
 * PROBLEM EXPLANATION:
 * Given the head of a linked list, remove the `n`th node from the end of the list and return its head.
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
let n4 = new ListNode(4);
let n5 = new ListNode(5);
let n6 = new ListNode(6);

n1.next = n2;
n2.next = n3;
n3.next = n4;
n4.next = n5;
n5.next = n6;





function nthNodeFromLast(head,n) {
    let slow = head;
    let fast = head;
    let counter=1
    while (fast !== null&&counter!=n) {
        fast = fast.next;
        counter += 1;
    }

    while (fast.next !== null) {
        fast = fast.next;
        slow=slow.next
    }
    return slow
  
  }
  console.log(nthNodeFromLast(n1,5));
    