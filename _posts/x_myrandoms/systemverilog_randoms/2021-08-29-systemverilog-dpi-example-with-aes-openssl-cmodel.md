---
layout: default
title: DPI example with AES-Openssl C-model
parent: Systemverilog Randoms
grand_parent: My Randoms
description: An example of using DPI to intergare the C-model of AES encryption built with Openssl library
tags: [systemverilog]
comments: true
toc_en: true
nav_exclude: false
search_exclude: false
nav_order: 3
---

# Systemverilog DPI example with AES-Openssl C-model
Iis 
{: .fs-5 .fw-500 }

---
## AES C-model built with Openssl library
### AES encryption with Openssl library
Let's take a C
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
[ aes.c ](https://gist.github.com/dvtalk/2621e72b0b3c19616459113d72905d39)

### Wrapper to interract with Systemverilog
<script src="https://gist.github.com/dvtalk/50280465f7c0f185fc6bc6001963169b.js"></script>
"svdpi.h"
C-SV type match

### Build .so files
{% highlight Makefile %}
LDFLAGS    = -Wl,-rpath,$(OPENSSL_PATH)/lib  -lssl -lcrypto
C_INCLUDE  = -I$(QUESTA_SIM_INS_DIR)/questasim/include

msft_c_model.so: aes_sv_c_dpi.c
	gcc -m64 -fPIC -g -W -shared -fdiagnostics-color=never -std=c99 $(C_INCLUDE) $(LDFLAGS) -o aes_sv_c_dpi.so aes_sv_c_dpi.c

aes: aes.c
	gcc -m64 -std=c99 $(C_INCLUDE) $(LDFLAGS) aes.c -o aes
{% endhighlight %}

---
## Calling C-model function in Systemverilog
### Loading C libary .so file
{% highlight verilog %}
   -sv_lib ${C_MODEL_DIR}/aes_sv_c_dpi
   // The EDA tool will load the ${C_MODEL_DIR}/aes_sv_c_dpi.so when run simulation
{% endhighlight %}

### Import the C function
Simply speaking, polymorphism means many possible ways. 
This means that we can have many different ways of execution but using the same piece of code.
Take this example below:
{% highlight verilog %}
   import "DPI-C" function int cAesEncrypt( input aes_enc_mode_e m_aes_mode,
      input  byte m_plaintext[],
      input  int  m_plaintext_len,
      input  byte m_key[],
      input  int  m_key_len,
      input  byte m_ivec[],
      output byte m_ciphertext[]);
{% endhighlight %}
* input
* output
* inout

### Calling C function
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

---
## Finding more information
To have more understanding as well as more examples, check below references:
1. The IEEE Standard for SystemVerilog, Chapter.35. Direct programming interface, Annex H DPI C layer.
1. EDA User guide (Questasim).
1. [How to Call C-functions from SystemVerilog Using DPI-C](https://www.amiq.com/consulting/2019/01/30/how-to-call-c-functions-from-systemverilog-using-dpi-c/)
1. [Openssl man page with examples](https://www.openssl.org/docs/manmaster/man3/EVP_EncryptInit.html)


