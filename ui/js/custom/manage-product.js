var productModal = $("#productModal");
var SingleProductModal = $("#SingleProductModal");
    $(function () {

        //JSON data by API call
        $.get(productListApiUrl, function (response) {
            if(response) {
                var table = '';
                $.each(response, function(index, product) {
                    table += '<tr data-id="'+ product.product_id +'" data-name="'+ product.name +'" data-unit="'+ product.uom_id +'" data-price="'+ product.price_per_unit +'">' +
                        '<td>'+ product.name +'</td>'+
                        '<td>'+ product.uom_name +'</td>'+
                        '<td>'+ product.price_per_unit +'</td>'+
                        '<td><span class="btn btn-xs btn-danger delete-product">Delete</span></td>'+
                        '<td><button type="button" class="btn btn-sm btn-primary pull-right edit-product" data-toggle="modal" data-target="#SingleProductModal">'+
                        'Edit Product</button></td></tr>';
                });
                $("table").find('tbody').empty().html(table);
            }
        });
    });

    // Save Product
    $("#saveProduct").on("click", function () {
        // If we found id value in form then update product detail
        var data = $("#productForm").serializeArray();
        var requestPayload = {
            product_name: null,
            uom_id: null,
            price_per_unit: null
        };
        for (var i=0;i<data.length;++i) {
            var element = data[i];
            switch(element.name) {
                case 'name':
                    requestPayload.product_name = element.value;
                    break;
                case 'uoms':
                    requestPayload.uom_id = element.value;
                    break;
                case 'price':
                    requestPayload.price_per_unit = element.value;
                    break;
            }
        }
        callApi("POST", productSaveApiUrl, {
            'data': JSON.stringify(requestPayload)
        });
    });

    
    $(document).on("click", ".delete-product", function (){
        var data = {
            product_id : tr.data('id')
        };
        var isDelete = confirm("Are you sure to delete "+ tr.data('name') +" item?");
        if (isDelete) {
            callApi("POST", productDeleteApiUrl, data);
        }
    });

    productModal.on('hide.bs.modal', function(){
        $("#id").val('0');
        $("#name, #unit, #price").val('');
        productModal.find('.modal-title').text('Add New Product');
    });

    productModal.on('show.bs.modal', function(){
        //JSON data by API call
        $.get(uomListApiUrl, function (response) {
            if(response) {
                var options = '<option value="">--Select--</option>';
                $.each(response, function(index, uom) {
                    options += '<option value="'+ uom.uom_id +'">'+ uom.uom_name +'</option>';
                });
                $("#uoms").empty().html(options);
            }
        });
    });

    $(document).on("click", ".edit-product", function (){
        var tr = $(this).closest('tr');
        $("#Singleid").val(tr.data('id'));
        $("#Singlename").val(tr.data('name'));
        $("#Singleprice").val(tr.data('price'));     
        $("#Singleuoms").attr('data-single-unit',tr.data('unit'));
        var data = {
            Singleuoms : tr.data('unit')
         //   product_name : tr.data('name')
        };

    });

    SingleProductModal.on('hide.bs.modal', function(){
        $("#id").val('0');
        $("#name, #unit, #price").val('');
        productModal.find('.modal-title').text('Edit Product');
    });

    SingleProductModal.on('show.bs.modal', function(){
        //JSON data by API call
        $.get(uomListApiUrl, function (response) {
            if(response) {
                var SingleUnit = $('#Singleuoms').attr('data-single-unit');
                $('#Singleuoms option:selected').removeAttr('selected');
                var options = '<option value="">--Select--</option>';
                $.each(response, function(index, uom) {

                    if (SingleUnit == uom.uom_id){
                        options += '<option value="'+ uom.uom_id +'" selected>'+ uom.uom_name +'</option>';
                    }else{
                        options += '<option value="'+ uom.uom_id +'">'+ uom.uom_name +'</option>';
                    }
                });
                $("#Singleuoms").empty().html(options);
            }
        });
    });
    