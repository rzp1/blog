# 1. What's the DNS?
> https://www.geeksforgeeks.org/computer-networks/working-of-domain-name-system-dns-server/


DNS is heiratical and distribution naming system that translate the domain to the IP address. 

when you type a domain name like "www.google.com" on the broswer, DNS ensures that requst reaches to the correct server by resolving the domain to it's corresponding IP address.

without DNS, we have to remember the numerical IP address like "54.42.31.199" to reach the website we want to visit, which is highly impractical. DNS simplifies the process by allowing us to use user-friendly names while still maintaining the performance and scalability required by modern internet operations.  

## How does DNS work?
#### 1. user input
    when we type a domain name like "www.google.com" into our broswer, our computer will starts process to find the corresponding IP address.
#### 2. check local cache
    the system first checked the local caches: 
    - Broswer cache
    - Operating system cache   
    - Router cache
#### 3. check host files
    if didn't found any IP addres in local caches, then checked host file.`/etc/hosts`
#### 4. Query DNS Resolver
    the DNS Resolver is a server provided by our Internet Service Provider(ISP) or a public DNS service like Google DNS(8.8.8.8) or Cloundflare(1,1,1,1). 
###### 1. Contact the Root Server
    to get Top-Level Domain Server `.com` 
###### 2. Query TLD Server
    to get Authoritative Server `.com`
###### 3. Query the Authoritative Server
    Retrieve the IP Address from Authoritative Server
#### 5. Return IP Address to Computer
#### 6. Connect to the Real Server
#### 7. Website Loads