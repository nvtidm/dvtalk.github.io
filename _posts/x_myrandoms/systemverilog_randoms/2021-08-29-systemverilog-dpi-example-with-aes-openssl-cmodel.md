---
layout: default
title: DPI example with AES-Openssl C-model
parent: Systemverilog Randoms
grand_parent: My Randoms
description: An example of using DPI to integrate the C-model of AES encryption built with Openssl library
tags: [systemverilog]
comments: true
toc_en: true
nav_exclude: false
search_exclude: false
nav_order: 3
---

# Systemverilog DPI example with AES-Openssl C-model
When creating scoreboard, there is a high possibility that we'll need to integrate the golden model written in other programming languages into our testbench.
Systemverilog support this with the DPI (Direct Programming Interface).
{: .fs-5 .fw-500 }

This post is an example of using DPI-C to make C model generate the expected data of AES encryption.
This AES model is built with Openssl.
{: .fs-5 .fw-500 }

---
## AES C-model built with Openssl library
### AES encryption with Openssl library
We're not gonna explain how to use Openssl library in this post, since it is pretty common and well explained in [the Openssl man page already](https://www.openssl.org/docs/manmaster/man3/EVP_EncryptInit.html).

Let use this c file which already implement the aes encryption using Openssl library.
To perform aes encryption, we need to call `aes_encrypt` with suitable input of array of data.

You can access to the full version here: [ aes.c ](https://gist.github.com/dvtalk/edca1d9753503cd03f04b495b040f0e3)
{% highlight c %}
   int aes_encrypt(enum AES_OP_MODE aes_mode,
               unsigned char *plaintext,
               int plaintext_len,
               unsigned char *key,
               int key_len,
               unsigned char *ivec,
               unsigned char *ciphertext)
   {
     ...
     return ciphertext_len;
   }
{% endhighlight %}
* The inputs are the `plaintext` to encrypt, the `key` and `ivec`. All of these inputs are passed to the function by using the pointer to the array of those data in memory.
Also, we need to supply the encryption mode, the size of the plaintext (in unit of byte) and key (in unit of bit).
* The output is `ciphertext`, it's an pointer to and array of data, and we passed that pointer to this function to store the output data.
Also, the function will return the size of ciphertext in unit of byte.

### C wrapper to interract with Systemverilog
Now, C and Systemverilog are two different programming languages, with different set of data types.

So, to be able to use this `aes_encrypt`, we need to make sure C and SV code understand each other by making a C wrapper file below.
<script src="https://gist.github.com/dvtalk/50280465f7c0f185fc6bc6001963169b.js"></script>
* We notice that the type of the plaintext, key, ivec, ciphertext array of bytes are not `unsigned char *` anymore.
Instead, their type is now `svOpenArrayHandle`. This type is pre-defined C type and it's equivalent to the array of int, byte, shortint,... type in Systemverilog.
Read this post for [other type mapping correspondence](https://www.amiq.com/consulting/2019/01/30/how-to-call-c-functions-from-systemverilog-using-dpi-c/).
* Then we just need to type cast to normal C data type and call the `aes_encrypt()` function.
* The pre-defined C type `svOpenArrayHandle` and the function `svGetArrayPtr` is defined in the `"svdpi.h"`. This file is provided by your EDA simulation tool.


### Building .so files
{% highlight Makefile %}
LDFLAGS    = -Wl,-rpath,$(OPENSSL_PATH)/lib  -lssl -lcrypto
C_INCLUDE  = -I$(QUESTA_SIM_INS_DIR)/questasim/include

all: msft_c_model.so aes

msft_c_model.so: aes_sv_c_dpi.c
	gcc -m64 -fPIC -g -W -shared -fdiagnostics-color=never -std=c99 $(C_INCLUDE) $(LDFLAGS) -o aes_sv_c_dpi.so aes_sv_c_dpi.c

aes: aes.c
	gcc -m64 -std=c99 $(C_INCLUDE) $(LDFLAGS) aes.c -o aes
{% endhighlight %}
* Finally we create a Makefile to generate the `aes_sv_c_dpi.so` file as above. This file will be load when running simulation so that we can call it in the Systemverilog testbench.
* We must add `-I$(QUESTA_SIM_INS_DIR)/questasim/include` so that the gcc compiler can find the `"svdpi.h"` file discussed above.
* Also, we should compile a `aes` executable file so that we can run and debug the encryption if necessary.

---
## Calling C-model function in Systemverilog
### Loading C libary .so file
{% highlight verilog %}
   -sv_lib ${C_MODEL_DIR}/aes_sv_c_dpi
   // The Questasim will load the ${C_MODEL_DIR}/aes_sv_c_dpi.so when run simulation
{% endhighlight %}
* This is depend on the EDA tool that you're using for simulation.
You need read your EDA tool User Guide to know suitable option to load the .so file as well as the location of the `"svdpi.h"` file.

### Importing the C function to SV testbench
When the C-model is loaded and ready to use, we just need to import it into our testbench as below.
{% highlight verilog %}
   import "DPI-C" function int cAesEncrypt(
      input  aes_enc_mode_e m_aes_mode,
      input  byte m_plaintext[],
      input  int  m_plaintext_len,
      input  byte m_key[],
      input  int  m_key_len,
      input  byte m_ivec[],
      output byte m_ciphertext[]);
{% endhighlight %}
* The `cAesEncrypt()` is the C-wrapper function that we created in [this](#c-wrapper-to-interract-with-systemverilog). The argument list in the `import` statement must have the same order as the C code function.
* The `input` in each argument means that that argument will be pass from SV to C code.
For example, we will pass the value of `m_plaintext_len` to the `svplaintext_len` input argument of the `cAesEncrypt()` in C code.
* For the `output` argument, in the other hand, the data will be passed from C code to SV code.
We actually pass the reference/pointer to the array in memory that will store the `m_ciphertext`, the C code will write data to the memory pointed by that pointer.

### Calling C function in Systemverilog
{% highlight verilog %}
      byte m_aes_plaintext[$];
      byte m_aes_key[$];
      byte m_aes_ivec[$]

      byte m_aes_ciphertext[4096];
      int  m_ciphertext_len;

      // generate the input data
      m_aes_plaintext = '{'hab, 'h02, 'h33, 'hff, 'haa, 'h22, 'h45};
      ...

      // Calling C function for encryption
      m_ciphertext_len = cAesEncrypt(
         get_aes_enc_mode(),     //enc mode
         m_aes_plaintext,        //enc data array
         m_aes_plaintext.size(), //enc data size
         m_aes_key,              //key array
         m_aes_key.size(),       //key size
         m_aes_ivec,             //ivec array
         m_aes_ciphertext);      //outputed cipher byte array
{% endhighlight %}
* Finally, we are able to call the C-function from Systemverilog testbench.
* Only 1 point to remember is that for all the `output` array, in this example is `m_aes_ciphertext` array, we must define a size of an array (here is 4096), otherwise it will create runtime error.

---
## Finding more information
To have more understanding as well as more examples, check below references:
1. The IEEE Standard for SystemVerilog, Chapter.35. Direct programming interface, Annex H DPI C layer.
1. EDA User guide (Questasim).
1. [How to Call C-functions from SystemVerilog Using DPI-C](https://www.amiq.com/consulting/2019/01/30/how-to-call-c-functions-from-systemverilog-using-dpi-c/)
1. [Openssl man page with examples](https://www.openssl.org/docs/manmaster/man3/EVP_EncryptInit.html)


